/**
 * Code to launch a Node.js web server that can respond to requests
 * */

'use strict';

// Importing necessary pakages and js files for the program
const book = require('./lib/bookCollection');
const query = require('querystring');

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
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(bodyParser.urlencoded({extended: true})); // parse form submissions

// Constant and Global Variables
const NOT_FOUND = -1;
const DEFAULT_KEY = 'title';
const itemKey = DEFAULT_KEY;

// Send static file as response
app.get('/', (req, res) => {
  res.type('text/html');
  res.render('home', {layout: 'main', book: book.getAll});
});

app.get('/about', (req, res) => {
  res.type('text/plain');
  res.sendFile(__dirname + '/about');
});

// Handle get method by GET request
app.get('/get', (req, res) => {
  const itemValue = parseSpecialTitleName(req.url);
  let result = book.get(itemKey, itemValue.toLowerCase());

  if (result == NOT_FOUND) result = false;

  res.type('text/html');
  res.render('details',
      {layout: 'main', title: req.query.title, result: result});
});

// Handle get method by POST request
app.post('/get', (req, res) => {
  // req.body will return JSON object //console.log(req.body);
  let result = book.get(itemKey, req.body.title.toLowerCase());

  if (result == NOT_FOUND) result = false;

  res.type('text/html');
  res.render('details',
      {layout: 'main', title: req.body.title, result: result});
});

app.get('/add', (req, res) => {
  const jsonObject = parseURLtoJSON(req.url);
  const result = book.add(jsonObject);

  res.type('text/html');
  res.render('home',
      {layout: 'main',
        title: req.query.title,
        result: result,
        book: book.getAll});
});

app.get('/delete', (req, res) => {
  let found = false;
  const itemValue = parseSpecialTitleName(req.url);
  const result = book.delete(itemKey, itemValue.toLowerCase());

  if (result != NOT_FOUND) found = true;

  res.type('text/html');
  res.render('delete',
      {layout: 'main', title: req.query.title, result: result, found: found});
});

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

/**
 * For add request case, convert URL to JSON object.
 * Then, set its propety to the Book type
 *
 * @param {req.url} path
 * @return {jsonObject}
 */
function parseURLtoJSON(path) {
  const itemURL = path.substr(path.indexOf('?')+1);
  const jsonObject = query.parse(itemURL);

  // IMPORTANT: have to convert [Object: null prototype] to book object
  Object.setPrototypeOf(jsonObject, book);

  return jsonObject;
}

/**
 * Parse special white spaces,%20, from the URL.
 * @param {req.url} path
 * @return {itemValue}
 */
function parseSpecialTitleName(path) {
  const regex = /%20/gi; // special white space from URL
  const itemURL = path.substr(path.indexOf('?')+1);
  let itemValue = itemURL.split('=')[1];

  // Replace all white space, %20, to ' '
  itemValue = itemValue.replace(regex, ' ');

  return itemValue;
}
