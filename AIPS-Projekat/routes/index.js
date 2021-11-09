const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");

// const socket = io('http://localhost:4000')
// socket.on('Chat',data=>
// {
//  console.log(data);
// })

// router.get("/", (req, res) => {
//   res.render("welcome");
// }); 
router.get("/", (req, res) => {
  res.render("welcome");
}); 
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
});

router.get("/users/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    name: req.user.name,
    email: req.user.email,
    date: req.user.date,
    slikaKorisnika: req.user.slikaKorisnika,
    lastConnection: req.user.lastConnection
  });
});

//http://localhost:3000/users/korisnici
router.get("/users/korisnici", ensureAuthenticated, (req, res) => {
  User.find({ name: { $ne: "admin" } }).then((users) => {
    res.render("korisnici", {
      users: users,
      name: req.user.name,
      lastConnection: req.user.lastConnection
    });
  });
});

module.exports = router;


/////  const socket = io('http://localhost:3000')
// var socket = io();
// socket.on('Chat',data=>
// {
//  //console.log(data);
//  console.log("Novi korisnik");
// })
///iliiiiiiiiiii
// io.on("connection", (socket) => {
//     socket.on("zapocniIgru", (podaci) => {
//     console.log(podaci);
//     console.log("Novi igrac");
//     });
// });

// const socket = require('socket.io');
// socket.on('chat',function(){
//     console.log("Poruka iz index1 iz socket.on");
// });