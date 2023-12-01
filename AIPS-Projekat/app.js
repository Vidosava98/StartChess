const express = require("express");
const expresLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const http = require ('http');
const mongoose = require("mongoose");
const socketio = require("socket.io");
const User = require('./models/User');
const Game = require('./models/Game');
//Observer pattern
const ChessTimer = require('./utils/Observer/ChessTimer');
const PlayerScoreboard = require('./utils/Observer/PlayerScoreboard');

var app = express();
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());
require("./config/passport")(passport);
const { addUser, removeUser, getUser } = require('./utils/users')
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
app.use("/chat",require("./routes/chat"));
app.use("/game",require("./routes/game"));
app.use("/changes", require("./config/changes"));



var server = http.createServer(app);
const io = socketio(server);
const chessTimer = new ChessTimer(0,0,0,0);
io.on('connection',(socket) => {
  console.log("New webSocket connection");
  socket.on('join', async (options, callback) => {
    const email = options.email;
    const userFromDatebase = await User.findOne({email:email});
    const username = userFromDatebase.name.toString();

    const { error, user } = addUser({ id: socket.id, username: username, room:options.room });

    if (error) {
        return callback(error);
    }

    socket.join(user.room);
    socket.broadcast.to(user.room).emit('info',`${email}`);
    socket.emit('ack', "Server je video da si stigao. Dobrodosao");
    const playerScoreboard = new PlayerScoreboard(socket);
    chessTimer.addTimerObserver(playerScoreboard);
    callback();
});
socket.on('doslaoba', async (options)=>{
  const user1 = await User.findOneAndUpdate({email: options.email1},{ color:'W'}, { new : true });
  const user2 = await User.findOneAndUpdate({email: options.email2},{ color:'B'}, { new : true });

  const newGame = new Game({ result:"",
  numbersOfFigure:32,
  kraj: false});

  newGame.igraci.push(user1);
  newGame.igraci.push(user2);
  const saveGame = await newGame.save();

    //update users lastConnection
    const user1Updated = await User.findOneAndUpdate({email: options.email1}, {lastConnection : saveGame.datumKreiranjaIgre});
    const user2Updated = await User.findOneAndUpdate({email: options.email2}, {lastConnection : saveGame.datumKreiranjaIgre});
    console.log(user1Updated);
    console.log(user2Updated);

  io.to(options.room).emit('prikaziPartiju', {r: saveGame.result, n: saveGame.numbersOfFigure, d: saveGame.datumKreiranjaIgre,
  user1: saveGame.igraci[0], user2: saveGame.igraci[1], id : saveGame._id
  });
  chessTimer.startTimer();
});
socket.on('disconnect', () => {
  const user = removeUser(socket.id);
  if (user) {
      socket.broadcast.to(user.room).emit('ack', `${user.username} has left the game!`);
  }
  chessTimer.stopTimer();
});
socket.on('sendMessage',(message, callback) => {
  console.log('Stigla je poruka sledeceg sadrzaja: ' + message);
  const user = getUser(socket.id);
  const username = user.username;
  const te = Date.now();
  console.log(te);
  const datumSlanjaPoruke = new Date(te);
  console.log(datumSlanjaPoruke);
  io.to(user.room).emit('message',{message, username, datumSlanjaPoruke});
  callback();
});
socket.on('posaljiPojedenuFiguru', async (options) =>{
  const user = getUser(socket.id);
  if(user){
  socket.broadcast.to(user.room).emit('proslediPojedenuFiguru', {pojedenaFigura: options.pojedenaFigura});
  }
  const gameUpdate = await Game.findById({_id: options.id});
  gameUpdate.numbersOfFigure = gameUpdate.numbersOfFigure - 1;
  const saveGame = await gameUpdate.save();
  console.log(saveGame);
  io.to(user.room).emit('updateNumbersOfFigure', {numbersOfFigure: saveGame.numbersOfFigure});
})
socket.on('posaljiVracenuFiguru', (options) => {
  const user = getUser(socket.id);
  if(user){
    console.log(options.x2, options.y2, options.html);
  socket.broadcast.to(user.room).emit('primiVracenuFiguru', {x2:options.x2, y2:options.y2, html:options.html});
  }
})
socket.on('pomeriFiguru',(options) => {
  const user = getUser(socket.id);
  if(user){
  socket.broadcast.to(user.room).emit('proslediPomeriFiguru',{x1: options.x1, y1: options.y1, x2:options.x2, y2: options.y2, img: options.img, krajJe: options.krajJe, rokada: options.rokada});
  }
  if(options.krajJe){
    chessTimer.stopTimer();
  }
})
socket.on('posaljiPotez',(options) => {
  const user = getUser(socket.id);
  if(user){
    io.to(user.room).emit('proslediPotez', {potez: options.potez, figuraKojaSeKrece: options.figuraKojaSeKrece, username: user.username});
    }
})
socket.on('posaljiRokaduZaPrikazUIstorijiPoteza',(options) => 
{
  const user = getUser(socket.id);
  if(user){
    socket.broadcast.to(user.room).emit('primiRokaduZaPrikazUIstorijiPoteza', {x1:options.x1 , y1:options.y1, x2:options.x2, y2:options.y2});
    }
});
});
server.listen(3000,() =>{console.log('Aplikacija osluskuje na portu:' + 3000);});

module.exports = app;
