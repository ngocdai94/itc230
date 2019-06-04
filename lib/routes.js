// Constant and Global Variables
const NOT_FOUND = -1;
const DEFAULT_KEY = 'title';
const itemKey = DEFAULT_KEY;

module.exports = (app) => {
    const Book = require('../models/book');
    const query = require('querystring');

    /********************** Express Handler Routes **********************/
    // Send static file as response
    app.get('/', (req, res, next) => {
        // return all item in book collections
        Book.find({}, (err, items) => {
            if (err) return next(err);
            console.log(items.length);
            res.type('text/html');
            res.render('home', {layout: 'main', book: JSON.stringify(items) }); 
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
    
        // delete a single record
        Book.deleteOne({title: deleteBook}, (err, result) => {
            if (err) return next(err);
            console.log(result);
        
            if (result != null) found = true;
        
            res.type('text/html');
            res.render('delete',{layout: 'main', title: req.query.title, result: result, found: found});
        }); 
    });
    /*************** End of Express Handler Routes ****************/
    
    /*********************** API Routes ***************************/
    app.get('/api/v1/books', (req,res) => {
        // return all item in book collections
        Book.find({}, (err, items) => {
            if (err) return res.status(500).send('Error occurred: database error.');
            console.log(items.length);
            res.type('text/html');
            res.json(items);
        });
    });
    
    app.get('/api/v1/book/:title', (req,res) => {
        const itemTitle = req.params.title;
        let my_pattern = new RegExp(itemTitle,"i"); // insentivtive letter cases
    
        // return a single record
        Book.findOne({"title":{$regex : my_pattern}}, (err, item) => {
        if (err) return next(err);
    
        if (item) { // found?
            console.log(item);
            res.type('text/html');
            res.json(item);
        } else {
            res.status(404).send('Not Found!');
        }
        }); 
    });
    
    app.get('/api/v1/add', (req,res) => {
        let newBook = {"title":req.query.title, "author":req.query.author, "price":req.query.price};
    
        Book.findByIdAndUpdate({_id:req.query._id}, newBook, (err, result) => {
        if (err) {
            new Book(newBook).save((err) => {
                res.json({"result":"added"});    
            });
        } else {
            res.json({"result":"updated"});    
        }
        });
    });

    app.post('/api/v1/add/', (req,res) => {
        let newBook = {"title":req.body.title, "author":req.body.author, "price":req.body.price};
    
        Book.findByIdAndUpdate({_id:req.body._id}, newBook, (err, result) => {
            if (err) {
                new Book(newBook).save((err) => {
                    res.json({"result":"added"});    
                });
            } else {
                res.json({"result":"updated"});    
            }
        });
    });
    
    app.get('/api/v1/book/delete/:title', (req,res) => {
        const itemTitle = req.params.title;
        let my_pattern = new RegExp(itemTitle,"i"); // insentivtive letter cases
    
        // delete a single record
        Book.deleteOne({"title":{$regex : my_pattern}}, (err, result) => {
            if (err) res.json({"result" : err});
            
            console.log(result);
        
            res.type('text/html');
            res.json({"result" : "deleted"});
        }); 
    });

    app.post('/api/v1/book/delete/:id', (req,res) => {
        /**
         * Bugs: in this method, req.body.id return undefined.
         */
        Book.deleteOne({"_id":req.params.id }, (err, result) => {
            if (err) res.json({"result":err});
            
            console.log(result);
            
            res.json({"result":"deleted"});
        });
    });
    /********************* End of API Routes **********************/

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
};