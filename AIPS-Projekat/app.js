const express = require("express");
const expresLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const http = require ('http');
var app = express();

app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/slikeKorisnika", express.static("slikeKorisnika"));
require("./config/passport")(passport);

// Mongo
const db = require("./config/keys").MongoURI;

// Connect
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Povezan na MongoDB..."))
  .catch((err) => console.log(err));

//EJS
app.use(expresLayouts);
app.set("view engine", "ejs");
//to
// app.use('/',(req,res)=>{
// res.render('proba')
// })


app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});
//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/figura", require("./routes/figura"));
app.use("/chat",require("./routes/chat"))
app.use("/game",require("./routes/game"));

app.get("/_form_changepassword", function (req, res) {
  res.render("_form_changepassword", {
    name: req.user.name,
  });
});
app.get("/_form_changeusername", function (req, res) {
  res.render("_form_changeusername", {
    name: req.user.name,
  });
});
var server = http.createServer(app);
server.listen(3000);
console.log('Aplikacija osluskuje na portu:' + 3000);
module.exports = app;


//socket.io
//const io = require('socket.io')(4000);


// var io = socketio.listen(server);
//  io.on("connection",(socket)=>{
//   console.log("socket connection");
//  })
//  console.log("Odradjeno");



// var socket = io('http://localhost:3000');
// const io = require('socket.io')(3000) 
//  io.on('connection',(socket)=>{
//   console.log('socket connection');
//  })

// io.sockets.on('connection',(socket)=> {
//   console.log('Novi klijent je konektovan');
// })
