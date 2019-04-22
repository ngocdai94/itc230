/** 
 * Code to launch a Node.js web server that can respond to requests
 * */ 

// Importing necessary pakages and js files for the program
const bookCollection = require ("./lib/bookCollection");
const querystring = require('querystring');
const http = require("http");   // require http pakage
const fs = require("fs");       // require file system package

// Constant Variables
const NOT_FOUND = -1;
const WHITE_SPACE_CASE_1 = '+';
const WHITE_SPACE_CASE_2 = '%20';

// Global Variables
var itemKey = '';
var itemValue = '';

// Initialize Node.js server and Listen on port 3000
http.createServer((req,res) => {
  // Get Request Path and Request Method
  const path = req.url; //.toLowerCase();
  var requestMethod = '';

  if (path.indexOf('?') != NOT_FOUND)
    requestMethod = path.substr(0, path.indexOf('?'));
  else {
    requestMethod = path;
  }
  
  /**  
   * Uncomment the lines below to check for URL path
  */
  // console.log(path);
  // console.log('Method request is... ' + requestMethod);

  // Response according to requested path/method and output data to browser
  switch(requestMethod) {
    case '/':
    /**
     * fs.readFile will read relative file path and send a result back to the
     * call back function (annonymous function).
     * 
     * In this annonymous function, err (error) and data will be returned from the
     * call back function.
     * Then, display data to browser if no error.
     */
      fs.readFile("public/home.html", (err, data) => {
        if (err) return console.error(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data.toString());
      });
    break;

    case '/about':
      fs.readFile("about", (err, data) => {
        if (err) return console.error(err);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(data.toString());
      });
    break;
    
    case '/get':
      // Return 1st index of the book collection if no search key is defined
      // Otherwise, return the search result for the search key
      if (path.indexOf('?') == NOT_FOUND) {
        var data = bookCollection.getAll();
        res.writeHead(200, {'Content-Type': 'text/JSON'});
        res.end(JSON.stringify(data[0]));
      } else {
        // parsing item key and value
        parseURL(path);

        // search and return search result
        var data = bookCollection.get(itemKey, itemValue.toLowerCase());
        if (data == NOT_FOUND) data = 'Not Found';
        res.writeHead(200, {'Content-Type': 'text/JSON'});
        res.end('Searching for ' + itemValue + ':\n' + JSON.stringify(data));
      }
    break;

    case '/getAll':
      var data = bookCollection.getAll();
      res.writeHead(200, {'Content-Type': 'text/JSON'});
      res.end(JSON.stringify(data));
    break;

    case '/add':
      if (path.indexOf('?') == NOT_FOUND) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Nothing to add');
      } else {
        // parsing add request URL key and value, then add to JSON book collection
        var itemURL = path.substr(path.indexOf('?')+1);
        var jsonObject = querystring.parse(itemURL);
        var result = bookCollection.add(jsonObject);
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(jsonObject) + ' is added.\n' + 'Total items is ' + result.total);
      }
    break;

    case '/delete':
      // Delete a requested item if in the list
      if (path.indexOf('?') == NOT_FOUND) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Please specify an item to delete!');
      } else {
        // parsing item key and value
        parseURL(path);

        // delete and return result
        var data = bookCollection.delete(itemKey, itemValue);
        if (data != NOT_FOUND) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(itemValue + ' removed.');
        } else {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(itemValue + ' not removed or have been removed.');
        }

        // check data in terminal
        // console.log('\n\n' + data + '\n\n');
      }
    break;

    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404:Page Not Found');
    break;
  }
}).listen(process.env.PORT || 3000);

function parseURL (path) {
  // parsing item key and value
  let regex = /%20/gi;
  let itemURL = path.substr(path.indexOf('?')+1);
  itemKey = itemURL.split('=')[0];
  itemValue = itemURL.split('=')[1];

  // Replace all white space, %20, to ' '
  itemValue = itemValue.replace(regex, ' ');
}