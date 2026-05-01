'use strict';

const express = require('express');
const helmet  = require('helmet');
const morgan  = require('morgan');

const { errorHandler } = require('./middleware/errorHandler');
const auditRoutes       = require('./routes/audit');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'CodeGuard AI Engine' }));

app.use('/api/v1', auditRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use(errorHandler);

module.exports = app;
