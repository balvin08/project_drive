    const express = require('express');
    const router = express.Router();
    const { body, validationResult } = require('express-validator');        // Import the express-validator module
    const userModel = require("../models/user.model"); // Ensure correct path
    const bcrypt = require('bcrypt');                                 // Import bcrypt
    const jwt = require('jsonwebtoken');                                    // Import jsonwebtoken

    // Export the router as a function that accepts jwtSecret
    module.exports = (jwtSecret) => {              //craeting a function that accepts jwtSecret in the parameter of the file not in ENV file 

        router.get('/register', (req, res) => {
            res.render("register");
        });

        router.get('/index', (req, res) => {
            res.render("index");
        });

        router.post('/register',
            body('email').trim().isEmail().isLength({ min: 13 }), //check if email is valid and has a minimum length of 13
            body('password').trim().isLength({ min: 3 }),         //check if password has a minimum length of 3
            body('username').trim().isLength({ min: 3 }),          //check if username has a minimum length of 3
            async (req, res) => {

                const errors = validationResult(req); // Validate the request
                if (!errors.isEmpty()) {               // If there are errors, return them
                    return res.status(400).json({
                        errors: errors.array(),
                        message: 'Invalid data'       // Return a message
                    });
                }

                const { email, username, password } = req.body;       // Extract email, username and password from the request

                const hashedPassword = await bcrypt.hash(password, 10); // Hashing password giving unqiue salt value

                const newUser = await userModel.create({      // Create a new
                    email,
                    username,
                    password: hashedPassword // Storing hashed password
                });

                           // Return the new user
               res.redirect('/user/login'); // Redirect to login page
           return
            });

        router.get('/login', (req, res) => {
            res.render("login");
        });

        router.post('/login',
            body('username').trim().isLength({ min: 3 }),
            body('password').trim().isLength({ min: 3 }),
            async (req, res) => {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array(),     // If there are errors, return them in array
                        message: 'Invalid data'
                    });
                }

                const { username, password } = req.body;      // Extract username and password from the request

                const user = await userModel.findOne({           // Find the user in the database
                    username: username
                });

                if (!user) {  // If the user is not found, return an error
                    return res.status(400).json({
                        message: 'User or password is incorrect'
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password); // Comparing password
                if (!isMatch) {                                                 // If the password does not match, return an error
                    return res.status(400).json({
                        message: 'User or password is incorrect'
                    });
                }

                const token = jwt.sign({                                  // Create a token
                    userid: user._id,
                    email: user.email,
                    password: user.password
                }, jwtSecret); // Using the passed jwtSecret

                res.cookie('token', token);                             // Set the token in a cookie
                res.redirect('/user/index'); // <-- not /home
                                   // Return a message
            });

        return router;                          // Return the router
    };
