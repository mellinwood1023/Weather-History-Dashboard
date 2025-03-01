import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import routes from './routes/index.js';
import { fileURLToPath } from 'node:url';

import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the routes

// const express = require('express');

// const routes = require('./routes/index.js');
const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname + '../client/dist')));
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true}));
app.use(express.json({limit: '50 mb'}));
// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
