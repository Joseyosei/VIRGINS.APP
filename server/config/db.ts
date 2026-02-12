import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/virgins', {
      // Mongoose 6+ defaults used here
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    // Fix: Cast process to any to access exit in environments where Node types are missing
    (process as any).exit(1);
  }
};

export default connectDB;