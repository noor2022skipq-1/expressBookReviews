const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password}= req.body;
  if(username && password){
    const users = public_users.filter(user=>user.username===username);
    if(users===0){
      public_users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else{
      return res.status(400).json({message: "Username already exists"});
    }
  }
  else{
    return res.status(400).json({message: "Username and/or password are not provided"});
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  new Promise((resolve,reject)=>resolve(books))
  .then(books=>{
    res.status(200).send(books);
  })
  .catch(err=>{
    res.status(404).json({
      message:"resourse not found"
    })
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve,reject)=>{
    if(isbn in books)resolve(books[isbn]);
    else reject();
  })
  .then(book=>{
    res.status(200).json(book);
  })
  .catch(err=>{
    res.status(404).json({
      message:"resourse not found"
    })
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  new Promise((resolve,reject)=>{
    for(let key in books){
      if(books[key].author===author)resolve(books[key]);
    }
    reject();
  })
  .then(book=>{
    res.status(200).json(book);
  })
  .catch(err=>{
    res.status(404).json({
      message:"resourse not found"
    })
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  new Promise((resolve,reject)=>{
    for(let key in books){
      if(books[key].title===title)resolve(books[key]);
    }
    reject();
  })
  .then(book=>{
    res.status(200).json(book);
  })
  .catch(err=>{
    res.status(404).json({
      message:"resourse not found"
    })
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(isbn in books){
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(400).json({message: "This isbn does not exist in the database"});
});

module.exports.general = public_users;
