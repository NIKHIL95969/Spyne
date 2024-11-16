import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import user from './routes/userRoute.js';
import car from './routes/carRoute.js';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// Load environment variables
dotenv.config({ path: './.env' });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Set environment mode and port
export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 4000;

const app = express();

// Middleware setup
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:["http://localhost:3000"],    
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "credentials","withCredentials"],
  credentials: true
}));
// Routes
app.use('/api/v1/user', user);
app.use('/api/v1/car', car);

// Error handling middleware
app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found'
  });
});

app.use(errorMiddleware);

// Start the server
app.listen(port, () => console.log(`Server is working on Port: ${port} in ${envMode} Mode.`));
