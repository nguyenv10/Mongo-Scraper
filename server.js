// Require Dependencies 
var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Setting up the port
var PORT = process.env.PORT || 3000;

// Express App
var app = express();

// Setting up Express Router
var router = express.Router();

// Requiring routes file to pass router object
require("./config/routes")(router);

// Set Public Folder as a static directory 
app.use(express.static(_dirname + "/public"));

// Connecting handlebars to express app
app.set ("view engine", "handlebars");

app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));

// Using bodyParsing in the app
app.use(bodyParser.urlencoded({
    extended: false
}));

// All requests goes through router middleware
app.use(router);

// Use deployed database or local mongoArticles database
var db = process.env.MONODB_URI || "mongodb://localhost/mongoArticles";

// Connecting mongoose to database
mongoose.connect(db, function(error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("connect mongoose is successful")
    }
});

// Listening on the port
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});
