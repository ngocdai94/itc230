// createServer (asynchronus function): 
const http = require("http");  
http.createServer((req,res) => { // => is a new syntax instead of using function
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Aloha world');
}).listen(process.env.PORT || 3000);