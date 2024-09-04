require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors'); // Fix: Correct the require statement
const app = express();
const contactRoutes = require('./routes/contact');

app.use(cors()); // Use CORS middleware
app.use(express.urlencoded())
app.use(bodyParser())
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api', contactRoutes); // Use contact routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
