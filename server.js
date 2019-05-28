/**
 * Created by russel on 19-May-19.
 */

let express = require('express'),
    exphbs  = require('express-handlebars'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    port = 8000,
    request = require("request"),
    cheerio = require("cheerio"),
    mongoose = require('mongoose');

app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json()); // parse form data client
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// Configuring the database
const dbConfig = require('./config/database.config.js');


mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./app/routes/index.js')(app);

app.listen(port, ()=>{
    console.log(`server running on port: ${port}`);
});

