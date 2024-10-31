const mongoose = require('mongoose');
const Recommendation = require('../../models/Recommendation');

beforeAll(async () => {
  // Connect to the MongoDB test database
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from MongoDB after all tests are done
  await mongoose.disconnect();
});

describe('Recommendation Model', () => {
  beforeEach(async () => {
    await Recommendation.deleteMany({});
  });

  describe('Creation and Validation', () => {
    it('should create a new recommendation with valid data', async () => {
      const validRecommendation = {
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: 85
      };

      const recommendation = new Recommendation(validRecommendation);
      const savedRecommendation = await recommendation.save();

      expect(savedRecommendation._id).toBeDefined();
      expect(savedRecommendation.userId.toString()).toBe(validRecommendation.userId.toString());
      expect(savedRecommendation.companyId.toString()).toBe(validRecommendation.companyId.toString());
      expect(savedRecommendation.score).toBe(validRecommendation.score);
    });

    it('should fail to create recommendation without required fields', async () => {
      const invalidRecommendation = new Recommendation({});

      let error;
      try {
        await invalidRecommendation.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.companyId).toBeDefined();
      expect(error.errors.score).toBeDefined();
    });

    it('should enforce minimum score', async () => {
      const recommendation = new Recommendation({
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: -1
      });

      let error;
      try {
        await recommendation.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.score).toBeDefined();
    });

    it('should enforce maximum score', async () => {
      const recommendation = new Recommendation({
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: 101
      });

      let error;
      try {
        await recommendation.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.score).toBeDefined();
    });
  });

  describe('Timestamps', () => {
    it('should create timestamps on save', async () => {
      const recommendation = new Recommendation({
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: 85
      });

      const savedRecommendation = await recommendation.save();

      expect(savedRecommendation.createdAt).toBeDefined();
      expect(savedRecommendation.updatedAt).toBeDefined();
      expect(savedRecommendation.createdAt).toBeInstanceOf(Date);
      expect(savedRecommendation.updatedAt).toBeInstanceOf(Date);
    });

    it('should update timestamp on modification', async () => {
      const recommendation = new Recommendation({
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: 85
      });

      await recommendation.save();
      const originalUpdatedAt = recommendation.updatedAt;

      // Wait a little bit to ensure timestamp will be different
      await new Promise(resolve => setTimeout(resolve, 100));

      recommendation.score = 90;
      await recommendation.save();

      expect(recommendation.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Indexes', () => {
    it('should have userId index', () => {
      const indexes = Object.keys(Recommendation.schema.indexes());
      const hasUserIdIndex = Recommendation.schema.indexes().some(index => 
        index[0].userId === 1
      );
      expect(hasUserIdIndex).toBe(true);
    });
  });

  describe('References', () => {
    it('should properly reference User model', () => {
      const userIdPath = Recommendation.schema.path('userId');
      expect(userIdPath.instance).toBe('ObjectID');
      expect(userIdPath.options.ref).toBe('User');
    });

    it('should properly reference Company model', () => {
      const companyIdPath = Recommendation.schema.path('companyId');
      expect(companyIdPath.instance).toBe('ObjectID');
      expect(companyIdPath.options.ref).toBe('Company');
    });
  });

  describe('Query Operations', () => {
    beforeEach(async () => {
      const userId = new mongoose.Types.ObjectId();
      const recommendations = [
        {
          userId,
          companyId: new mongoose.Types.ObjectId(),
          score: 85
        },
        {
          userId,
          companyId: new mongoose.Types.ObjectId(),
          score: 90
        }
      ];

      await Recommendation.insertMany(recommendations);
    });

    it('should find recommendations by userId', async () => {
      const userId = new mongoose.Types.ObjectId();
      const recommendations = await Recommendation.find({ userId });
      
      expect(Array.isArray(recommendations)).toBe(true);
      recommendations.forEach(rec => {
        expect(rec.userId.toString()).toBe(userId.toString());
      });
    });

    it('should find recommendations by score range', async () => {
      const recommendations = await Recommendation.find({
        score: { $gte: 85, $lte: 95 }
      });

      recommendations.forEach(rec => {
        expect(rec.score).toBeGreaterThanOrEqual(85);
        expect(rec.score).toBeLessThanOrEqual(95);
      });
    });
  });
});
