'use strict';

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const { errorHandler } = require('./middleware/errorHandler');
const auditRoutes       = require('./routes/audit');

const app = express();

// CORS configuration for frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '10mb' })); // Increased limit for large code files
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'CodeGuard AI Engine',
  version: '1.0.0',
  timestamp: new Date().toISOString()
}));

// API routes
app.use('/api/v1', auditRoutes);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use(errorHandler);

module.exports = app;
