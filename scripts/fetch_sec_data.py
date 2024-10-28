import requests
import pandas as pd
from datetime import datetime
import time
from pymongo import MongoClient
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SECDataCollector:
    def __init__(self, mongodb_uri: str, user_agent: str):
        """
        Initialize the SEC data collector with MongoDB connection and configuration.
        
        Args:
            mongodb_uri: MongoDB connection string
            user_agent: SEC API user agent string (required by SEC)
        """
        self.SEC_API_BASE = "https://data.sec.gov/submissions"
        self.COMPANY_FACTS_BASE = "https://data.sec.gov/api/xbrl/companyfacts"
        self.HEADERS = {
            "User-Agent": user_agent,
            "Accept": "application/json"
        }
        self.mongo_client = MongoClient(mongodb_uri)
        self.db = self.mongo_client.company_profiles

    def _make_request(self, url: str) -> Optional[Dict]:
        """Make a request to the SEC API with rate limiting and error handling."""
        try:
            response = requests.get(url, headers=self.HEADERS)
            response.raise_for_status()
            time.sleep(0.1)  # SEC rate limit compliance
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error making request to {url}: {str(e)}")
            return None

    def get_company_submissions(self, cik: str) -> Optional[Dict]:
        """Fetch company submission data from SEC API."""
        url = f"{self.SEC_API_BASE}/CIK{cik.zfill(10)}.json"
        return self._make_request(url)

    def get_company_facts(self, cik: str) -> Optional[Dict]:
        """Fetch detailed company facts from SEC API."""
        url = f"{self.COMPANY_FACTS_BASE}/CIK{cik.zfill(10)}.json"
        return self._make_request(url)

    def extract_financial_data(self, submissions: Dict, facts: Optional[Dict]) -> Dict:
        """
        Extract key financial metrics from SEC filings, with data validation.
        Focuses on the most recent 10-K filing data.
        """
        financials = {
            'lastUpdated': datetime.now().isoformat(),
            'source': 'SEC EDGAR'
        }

        try:
            recent = submissions['filings']['recent']
            
            # Find most recent 10-K filing
            for idx, form in enumerate(recent['form']):
                if form == '10-K':
                    filing_date = recent['filingDate'][idx]
                    
                    # Extract available financial metrics
                    metrics = {
                        'totalAssets': recent.get('totalAssets', [None])[idx],
                        'totalLiabilities': recent.get('totalLiabilities', [None])[idx],
                        'revenues': recent.get('revenues', [None])[idx],
                        'netIncome': recent.get('netIncome', [None])[idx],
                        'earningsPerShare': recent.get('earningsPerShare', [None])[idx],
                        'filingDate': filing_date
                    }
                    
                    # Filter out None values
                    financials['metrics'] = {k: v for k, v in metrics.items() if v is not None}
                    break

            # Extract facts if available
            if facts:
                try:
                    units = facts.get('facts', {}).get('us-gaap', {})
                    
                    # Common financial metrics in facts
                    fact_metrics = {
                        'Assets': 'totalAssets',
                        'Liabilities': 'totalLiabilities',
                        'Revenues': 'revenues',
                        'NetIncomeLoss': 'netIncome',
                    }

                    for fact_key, metric_name in fact_metrics.items():
                        if fact_key in units:
                            values = units[fact_key].get('units', {}).get('USD', [])
                            if values:
                                # Get most recent value
                                recent_value = max(values, key=lambda x: x.get('end', ''))
                                financials['metrics'][metric_name] = recent_value.get('val')

                except KeyError as e:
                    logger.warning(f"Error extracting facts data: {str(e)}")

        except KeyError as e:
            logger.error(f"Error extracting financial data: {str(e)}")

        return financials

    def extract_company_profile(self, submissions: Dict) -> Dict:
        """Extract basic company profile information with validation."""
        return {
            'name': submissions.get('name', ''),
            'cik': submissions.get('cik', ''),
            'sic': submissions.get('sic', ''),
            'sicDescription': submissions.get('sicDescription', ''),
            'tickers': submissions.get('tickers', []),
            'exchanges': submissions.get('exchanges', []),
            'fiscalYearEnd': submissions.get('fiscalYearEnd', ''),
            'stateOfIncorporation': submissions.get('stateOfIncorporation', ''),
            'phones': submissions.get('phones', [])
        }

    def extract_filing_history(self, submissions: Dict) -> List[Dict]:
        """Extract recent filing history."""
        try:
            recent = submissions['filings']['recent']
            return [{
                'form': form,
                'filingDate': date,
                'accessionNumber': accession,
                'primaryDocument': doc
            } for form, date, accession, doc in zip(
                recent['form'],
                recent['filingDate'],
                recent['accessionNumber'],
                recent['primaryDocument']
            )]
        except KeyError:
            return []

    def process_company(self, cik: str) -> None:
        """
        Process and store complete company data.
        """
        submissions = self.get_company_submissions(cik)
        if not submissions:
            logger.error(f"Failed to fetch submissions for CIK {cik}")
            return

        facts = self.get_company_facts(cik)
        
        company_data = {
            'profile': self.extract_company_profile(submissions),
            'financials': self.extract_financial_data(submissions, facts),
            'filingHistory': self.extract_filing_history(submissions),
            'lastUpdated': datetime.now().isoformat()
        }

        # Store in MongoDB
        try:
            self.db.companies.update_one(
                {'profile.cik': cik},
                {'$set': company_data},
                upsert=True
            )
            logger.info(f"Successfully updated data for CIK {cik}")
        except Exception as e:
            logger.error(f"Error storing data in MongoDB for CIK {cik}: {str(e)}")

def main():
    # Fortune 500 company CIKs (example)
    FORTUNE_500_CIKS = [
        "0000320193",  # Apple
        "0000789019",  # Microsoft
        "0001652044",  # Alphabet
        "0001018724",  # Amazon
        "0000051143",  # IBM
        "0000078003",  # JPMorgan Chase
        "0000070858",  # Walmart
        "0001326801",  # Meta
        "0000200406",  # Chevron
        "0001534701",  # Tesla
    ]

    # Initialize collector
    collector = SECDataCollector(
        mongodb_uri="mongodb://localhost:27017/",  # Replace with your MongoDB URI
        user_agent="Source INC aligntheapp@gmail.com"  # Replace with your details
    )

    # Process each company
    for cik in FORTUNE_500_CIKS:
        try:
            collector.process_company(cik)
            time.sleep(0.1)  # SEC rate limit compliance
        except Exception as e:
            logger.error(f"Error processing CIK {cik}: {str(e)}")

if __name__ == "__main__":
    main()
