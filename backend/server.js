import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
// Importing routes
import authRoutes from './routes/auth.route.js'; // Importing auth routes
import userRoutes from './routes/user.route.js'; // Importing user routes
import postRoutes from './routes/post.route.js'; // Importing post routes
import notificationRoutes from './routes/notification.route.js'; // Importing notification routes

// Importing database connection function
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config(); // Load environment variables from .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

// Middleware to parse JSON bodies
app.use(express.json({ limit: '5mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware to parse cookies

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the Twitter Clone API!');
});

app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/users', userRoutes); // Use user routes
app.use('/api/posts', postRoutes); // Use post routes
app.use('/api/notifications', notificationRoutes); // Use notification routes

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Connect to MongoDB (assuming connectMongoDB is defined in a separate file)
    connectMongoDB()
});