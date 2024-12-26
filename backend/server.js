require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors'); // Add cors
const User = require('./models/user.model.js');
const userRoute = require('./routes/user.route.js');
const runRoomRoute = require('./routes/runRoom.route.js');
const chatController = require('./controllers/chat.controller.js'); // Add chat controller

const app = express();

// Add this logging to check environment variables
console.log('Checking environment variables...');
console.log('SECRET_KEY:', process.env.SECRET_KEY ? 'Set' : 'Not set');
console.log('ZHIPU_API_KEY:', process.env.ZHIPU_API_KEY ? 'Set' : 'Not set');

if (!process.env.SECRET_KEY || !process.env.ZHIPU_API_KEY) {
  console.error('WARNING: Required environment variables are not set');
}

// middleware
app.use(cors()); // Add cors middleware
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://DatabaseAccess:DatabaseAccess@127.0.0.1:27017?authSource=admin';
let mongoConnectionStatus = 'MongoDB is not connected :(';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB!');
    mongoConnectionStatus = 'MongoDB is connected!';
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// routes
app.use('/api/users', userRoute);
app.use('/api/runRoom', runRoomRoute);
app.use('/api/chat', chatController); // Add chat routes

app.get('/', (request, response) => {
  response.send('This is server.js running, ' + mongoConnectionStatus);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;