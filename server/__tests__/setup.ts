import mongoose from 'mongoose';

beforeAll(async () => {
  // Use in-memory MongoDB for tests if available, otherwise skip DB tests
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/virgins_test';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
  } catch {
    console.warn('[Test Setup] MongoDB not available — DB-dependent tests will fail');
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({}).catch(() => {});
    }
  }
});

afterAll(async () => {
  await mongoose.connection.close().catch(() => {});
});
