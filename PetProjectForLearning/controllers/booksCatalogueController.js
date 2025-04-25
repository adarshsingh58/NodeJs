const {promises: fsPromise} = require("fs");
const path = require("path");
const books = require('../models/booksCatalogue.json');

const getAllBooks = (req, res) => {
    res.json(books);
};

const addBook = (req, res) => {
    const {name, publisher, genre} = req.body;
    if (name === undefined || publisher === undefined) {
        console.log("No Name or Publisher Provided in the Input Request")
        return res.status(401).json({"message": "No Name or Publisher Provided in the Input Request"});
    }
    if (books.find(book => book.name === name)) {
        console.log(`Book with Name ${name} already exist`);
        return res.status(401).json({"message": `Book with Name ${name} already exist`});
    }
    books.push({"name": name, "publisher": publisher, "genre": genre});
    fsPromise.writeFile(
        path.join(__dirname, '..', 'models', 'booksCatalogue.json'), JSON.stringify(books)
    );
    res.json({"message": `Book ${name} added`});
};

const deleteBook = (req, res) => {
    const {name} = req.body;
    if (name === undefined) {
        console.log("No Name or Publisher Provided in the Input Request")
        return res.status(401).json({"message": "No Name or Publisher Provided in the Input Request"});
    }
    const book = books.find(book => book.name === name);
    if (book === undefined) {
        console.log(`Book with Name ${name} doesnt exist`);
        return res.status(401).json({"message": `Book with Name ${name} doesnt exist`});
    }
    books.splice(books.indexOf(book), 1);
    fsPromise.writeFile(
        path.join(__dirname, '..', 'models', 'booksCatalogue.json'), JSON.stringify(books)
    );
    res.json({"message": `Book ${name} deleted`});
};


module.exports = {getAllBooks, addBook, deleteBook}