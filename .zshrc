# Node.js
export PATH="/usr/local/bin:/usr/local/sbin:$PATH"

# MongoDB CLI (Optional)
export PATH="/usr/local/opt/mongodb-community/bin:$PATH"

# Google Cloud SDK (for Google Vision)
export PATH="/usr/local/google-cloud-sdk/bin:$PATH"

# Python
export PATH="/usr/local/bin/python3:/usr/local/bin:$PATH"

# Redis CLI Configuration
export REDIS_HOST="redis-19878.c335.eu-west-2-1.gce.redislabs.com"
export REDIS_PORT="19878"
export REDIS_PASSWORD="CxJtCAhMBAjCwv5ZhSN8AEUL3a2h7JEc"

# Aliases for Redis CLI Access
alias redis-connect="redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD"

# Load environment variables from project-specific .env file if needed
export ENV_PATH="/path/to/your/project/.env"
if [ -f "$ENV_PATH" ]; then
  export $(grep -v '^#' $ENV_PATH | xargs)
fi

# Aliases for convenience
alias start-align="cd /path/to/align-backend && npm run dev"  # Starts the development server
alias test-align="cd /path/to/align-backend && npm test"     # Runs tests for the backend
