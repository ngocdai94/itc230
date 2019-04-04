// Code to launch a Node.js web server that can respond to requests

const http = require("http");   // require http pakage
const fs = require("fs");       // require file system package

// Initialize Node.js server and Listen on port 3000
http.createServer((req,res) => {
  // Get Request Path
  const path = req.url.toLowerCase();
  console.log(path);

  // Response according to requested path and output data to browser
  switch(path) {
    case '/':
    /**
     * fs.readFile will read relative file path and send a result back to the
     * call back (annonymous function).
     * 
     * In this annonymous function, err (error) and data will be handled.
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

    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404:Page Not Found');
    break;
  }
}).listen(process.env.PORT || 3000);



/***** More Advanced Code from the instructor, Brenden West. ******/

// const http = require("http")
// const fs = require("fs"); 

// function serveStatic(res, path, contentType, responseCode){
//   if(!responseCode) responseCode = 200;
//   console.log(__dirname + path)
//   fs.readFile(__dirname + path, function(err, data){
//       if(err){
//         res.writeHead(500, {'Content-Type': 'text/plain'});
//         res.end('Internal Server Error');
//       }
//       else{
//         res.writeHead(responseCode, {'Content-Type': contentType});
//         res.end(data);
//       }
//   });
// }

// http.createServer((req,res) => {
//   var path = req.url.toLowerCase();
//   switch(path) {
//     case '/': 
//       serveStatic(res, '/public/home.html', 'text/html');
//       break;
//     case '/about':
//       //res.writeHead(200, {'Content-Type': 'text/plain'});
//       // res.end('About');
//       serveStatic(res, '/about', 'text/plain');
//       break;
//     default:
//       res.writeHead(404, {'Content-Type': 'text/plain'});
//       res.end('404:Page Not Found.');
//   }
// }).listen(process.env.PORT || 3000);