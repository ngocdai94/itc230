/**
 * Code to launch a Node.js web server that can respond to requests
 * */

'use strict';

// Importing necessary pakages and js files for the program
const Book = require('./models/book');
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
app.get('/', (req, res, next) => {
  // return all item in book collections
  Book.find({}, (err, items) => {
    if (err) return next(err);
    console.log(items.length);
    res.type('text/html');
    res.render('home', {layout: 'main', book: items }); 
  });
});

app.get('/about', (req, res) => {
  res.type('text/plain');
  res.sendFile(__dirname + '/about');
});

// Handle get method by GET request
app.get('/get', (req, res, next) => {
  const itemTitle = parseSpecialTitleName(req.url);
  let my_pattern = new RegExp(itemTitle,"i"); // insentivtive letter cases

  // return a single record
  Book.findOne({title:{$regex : my_pattern}}, (err, item) => {
    if (err) return next(err);
    console.log(item);
    res.type('text/html');
    res.render('details',{layout: 'main', title: itemTitle, result: item});
  }); 
});

// Handle get method by POST request
app.post('/get', (req, res, next) => {
  let my_pattern = new RegExp(req.body.title,"i"); // insentivtive letter cases

  // return a single record
  Book.findOne({title:{$regex : my_pattern}}, (err, item) => {
    if (err) return next(err);
    console.log(item);
    res.type('text/html');
    res.render('details',{layout: 'main', title: req.body.title, result: item});
  }); 
});

app.get('/add', (req, res, next) => {
  const newBook = parseURLtoJSON(req.url);

  // insert or update a single record
  Book.updateOne({title: req.query.title}, newBook, {upsert:true}, (err, result) => {
    if (err) return next(err);
    console.log(result);
    
    Book.find({}, (err, items) => {
      if (err) return next(err);
      console.log(items.length);
      res.type('text/html');
      res.render('home', {layout:'main', title: req.query.title, result: result, found: result.nModified == 0, book:items});
    });
  }); 
});

app.get('/delete', (req, res, next) => {
  let found = false;
  const deleteBook = parseSpecialTitleName(req.url);

  // insert or update a single record
  Book.deleteOne({title: deleteBook}, (err, result) => {
    if (err) return next(err);
    console.log(result);

    if (result != null) found = true;

    res.type('text/html');
    res.render('delete',{layout: 'main', title: req.query.title, result: result, found: found});
  }); 
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
  Object.setPrototypeOf(jsonObject, Book);

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
