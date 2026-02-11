import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }) as any); // Increased limit for image/video uploads

// Connect to Database
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Virgins API is running. Love Worth Waiting For.');
});

// Error Handling Middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});