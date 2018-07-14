// Import libraries
const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport');

// Import other files
const router = require('./routes/index');

// Import config files
const databaseConfig = require('./config/database');

// Create an express instance
var app = express();

// Configure the app to use body-parser to correctly parse data from requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up passport
app.use(passport.initialize());

// Figure out which port to use
var port = process.env.PORT || 3000;

// Set the app to use our router
app.use('/', router);

// Connect to MongoDB
mongoose.connect(databaseConfig.address)
    .then(function(result) {
        console.log("Successfully connected to database!");
    })
    .catch(function(err) {
        console.log(err);
    });

// Start the server
app.listen(port);
console.log("Server started on port " + port);
