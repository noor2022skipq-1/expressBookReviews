const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter(user=>user.username===username && user.password===password);
  return validusers.length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
   const {username,password}=req.body;
   if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
   }

   if(authenticatedUser(username,password)){
    let accessToken=jwt.sign({
      data:password,
    },'access',{expiresIn:60*60});
    req.session.authorization={
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
   }
   else{
     return res.status(208).json({message: "Invalid Login. Check username and password"});
   }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  if(isbn in books){
      books[isbn].reviews[req.user.username]=review;
      return res.status(200).json({message:"Review added successfully"});
  }
  return res.status(400).json({message: "This book isbn does not exist in the database"});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(isbn in books){
    delete books[isbn].reviews[req.user.username];
    return res.status(200).json({message:"Review deleted successfully"});
  }
  return res.status(400).json({message: "This book isbn does not exist in the database"});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
