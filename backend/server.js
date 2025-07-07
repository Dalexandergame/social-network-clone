import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js'; // Importing auth routes
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware to parse cookies

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the Twitter Clone API!');
});

// Use auth routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Connect to MongoDB (assuming connectMongoDB is defined in a separate file)
    connectMongoDB()
});