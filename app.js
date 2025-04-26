const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const userRouter = require("./routes/user.route"); // Import the router

const dbconnection = require('./config/db'); // Import the DB connection

const app = express();
const jwtSecret = 'max-furiosa'; // Directly define your secret key here
const index_router=require('./routes/index.route');     //importing the index router




// Use the cookieParser middleware
app.use(cookieParser());

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public'))); // <-- ADD THIS LINE

app.set('view engine', 'ejs'); // Set view engine to EJS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Use the userRouter and pass jwtSecret
app.use('/user', userRouter(jwtSecret)); // Pass the jwtSecret to the user routes

app.use('/home',index_router); // Use the index router

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//2.30
//3.12 