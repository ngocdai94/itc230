// Constant Variable
const NOT_FOUND = -1;

var bookCollection = [
    { title:'Moby Dick', author: 'Robot #1', price:20 },
    { title:'Tom Sawyer', author: 'Robot #2', price:10 },
    { title:'Sawyer Tom', author: 'Robot #3', price:5 },
    { title:'Google', author: 'Robot #4', price:15 },
    { title:'War & Peace', author: 'Robot #5', price:25 }
];

exports.get = (key, value) => {
    var foundResult = bookCollection.find((book) => {
        if (key === 'title') {
            return book.title.toLowerCase() === value;
        } else if (key === 'author') {
            return book.author.toLowerCase() === value;
        } else if (key === 'price') {
            return book.price.toLowerCase() === value;
        } else {
            return NOT_FOUND;
        }
    });
    return foundResult;
}

exports.getAll = () => {
    return bookCollection;
}

exports.add = (itemURL) => {
    const oldLength = bookCollection.length;
    let key = 'title';
    let itemFound = this.get(key, itemURL.title.toLowerCase());
    if (itemFound == undefined) {
        bookCollection.push(itemURL);
    }
    // console.log(JSON.stringify(itemURL));
    // console.log(bookCollection);
    return {added: oldLength !== bookCollection.length, total: bookCollection.length };
}

exports.delete = (key, value) => {
    var deleteIndex = bookCollection.findIndex((book) => {
        if (key === 'title') {
            return book.title.toLowerCase() === value;
        } else if (key === 'author') {
            return book.author.toLowerCase() === value;
        } else if (key === 'price') {
            return book.price.toLowerCase() === value;
        } else {
            return NOT_FOUND;
        }
    });

    if (deleteIndex >= 0) {
        // console.log('Index of ' + value + ' is ' + deleteIndex);
        bookCollection.splice(deleteIndex, 1);
        return bookCollection;
    } 
    return NOT_FOUND
}