import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import groupRoutes from './routes/groupRoutes';
import itineraryRoutes from './routes/itineraryRoutes';
import userRoutes from './routes/userRoutes';
import { configureKinde, protectRoute } from './services/kinde';
import openai from './services/openai';
import pineconeIndex from './services/pinecone';
import prisma from './services/prisma';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Session middleware (required for Kinde)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if using HTTPS
  })
);

// Setup Kinde authentication
configureKinde(app);

// CORS middleware for frontend (localhost:5173)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Example protected route to test Kinde auth
app.get('/api/protected', protectRoute, (_req, res) => {
  res.json({ message: 'You are authenticated with Kinde!' });
});

// Test OpenAI
app.get('/api/test-openai', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say hello!' }],
    });
    res.json(completion.choices[0].message);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? 'OpenAI err: ' + err.message : err,
    });
  }
});

// Test Pinecone
app.get('/api/test-pinecone', async (req, res) => {
  try {
    const stats = await pineconeIndex.describeIndexStats();
    res.json({ indexName: process.env.PINECONE_INDEX_NAME, stats });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? 'Pinecone err: ' + err.message : err,
    });
  }
});

// Test Prisma
app.get('/api/test-prisma', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? 'Postgres err: ' + err.message : err,
    });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/itineraries', itineraryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TripMeld API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});
