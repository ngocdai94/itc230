/**
 * Code to launch a Node.js, Express.js web server that can respond to requests
 * 
 */
'use strict';

// Using express
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Views & Templating
const handlebars = require('express-handlebars');
app.engine('.html', handlebars({extname: '.html'}));
app.set('view engine', '.html');

// Configuing express for index.js
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));   // set location for static files
app.use(bodyParser.json());                       // parse application/json
app.use(bodyParser.urlencoded({extended: true})); // parse form submissions
app.use('/api', require('cors')());               // set Access-Control-Allow-Origin header for api route

// Get routes ready
let routes = require("./lib/routes")(app);

// Define 404 handler
app.use( (req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not found');
});

// Initilize node.js server on defined port
app.listen(app.get('port'), () => {
  console.log('Express started');
});