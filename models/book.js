const credential = require ('../confidential/confidential');
const mongoose = require('mongoose');

// remote db connection settings. For security, connectionString should be in a separate file not committed to git
// const connectionString = "mongodb+srv://<dbuser>:<dbpassword>@<cluster>.mongodb.net/test?retryWrites=true";

// local db connection settings 
// const ip = process.env.ip || '127.0.0.1';
// const connectionString = 'mongodb://' +ip+ '/<DB_NAME>';

mongoose.connect(credential.connectionString, { dbName: 'itc-230', useNewUrlParser: true }); 

mongoose.connection.on('open', () => {
  console.log('Mongoose connected.');
});

// define Book model in JSON key/value pairs
// values indicate the data type of each key
const mySchema = mongoose.Schema({
 title: { type: String, required: true },
 author: String,
 price: Number
//  count: Number,
//  pubdate: Date,
//  inStore: Boolean
}); 

/**
 * 
 * IMPORTANT:mongoose assumes the collection name is a lower-case, 
 * plural version of the model name (e.g. 'books'). 
 * If your collection differs from this convention, you need to specify it explicitly
 */
module.exports = mongoose.model('books', mySchema);
