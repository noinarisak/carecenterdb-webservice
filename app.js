var express = require('express'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    bodyParser = require('body-parser');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Connect to MongoDB 
 */
var db;
if (process.env.ENV == 'Test') {
    db = mongoose.connect(process.env.MONGODB_URI_TEST);
}
else {
    db = mongoose.connect(process.env.MONGODB_URI);
}
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Setup ExpressJS
 */
var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/**
 * Setup Mongoose Model(s) and Route(s)
 */
var Book = require('./models/bookModel');
var bookRouter = require('./routes/bookRoutes')(Book);
app.use('/api/books', bookRouter);

/**
 * Handle the root GET call
 */
app.get('/', function(req, res) {
   res.send('Welcome to my API.');
});


app.listen(port, function() {
    console.log('Now it changed to something else. Running on PORT:' + port);
});

module.exports = app;