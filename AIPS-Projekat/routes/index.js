const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const Igra = require("../models/Game");
const Games = require("../models/Game");

router.get("/", (req, res) => {
  res.render("login");
}); 
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
});
router.get("/zapocniPartiju", (req,res) =>{
    Games.findOne({ kraj: false })
    .then((game) => {
      console.log(game);
      if(game.igraci.length == 1)
      {
      game.igraci.push(req.user._id);
      game.kraj = true;
      game.save();
      User.find({ $or: [{_id:game.igraci[0]},{ _id:game.igraci[1]}] }).then((igraci) => {
        console.log("U if sam");
        res.render("partija", {
          igraci: igraci,
          game:  game
        });
      });
      } else{
        User.find({ $or: [{_id:game.igraci[0]},{ _id:game.igraci[1]}] }).then((igraci) => {
          console.log("U else sam");
          res.render("partija", {
            igraci: igraci,
            game:  game
          });
        });
      }
    })
    .catch((err) => {
      console.log("U catch sam");
      var partija= new Games({
          result:"Nema rezultata jos uvek",
          kraj: false,
          white:"16",
          black:"16",
          numbersOfFigure:"32"
      });
      partija.igraci.push(req.user._id);
      //Treba da se igracu izmene neki atributi, npr treba da se doda koje je boje,bela ili crna
      const sacuvanaPartija = partija.save();
      console.log(sacuvanaPartija);
      //Treba da se napravi jedna provera koja ce da ceka da jos neko doda svoj id u tu partiju
      User.find({ _id:partija.igraci[0]}).then((igraci) => {
        console.log(igraci);
        res.render("partija", {
          igraci: igraci,
          game:  partija
        });
      });
    });

});
router.get("/VratiProfil", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    name: req.user.name,
    email:req.user.email,
    date: req.user.date,
    slikaKorisnika: req.user.slikaKorisnika,
    lastConnection: req.user.lastConnection
  });
});

//http://localhost:3000/users/korisnici
router.get("/VratiSveKorisnike", ensureAuthenticated, (req, res) => {
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