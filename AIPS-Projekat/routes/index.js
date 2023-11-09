const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const Game = require("../models/Game");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const { StrictEventEmitter } = require("socket.io/dist/typed-events");

//http://localhost:3000/
router.get("/", (req, res) => {
 res.render("login");
}); 
//http://localhost:3000/dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
});
//http://localhost:3000/ZapocniPartiju
router.get("/ZapocniPartiju", (req,res) =>{
    Game.findOne({ kraj: false })
    .then((game) => {
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
      var partija= new Game({
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
//http://localhost:3000/VratiProfil
router.get("/VratiProfil", ensureAuthenticated, (req, res) => {
console.log(req.body);
User.findById(req.user._id).then((user) =>{
  res.render("profile", {
    name: user.name,
    email:user.email,
    date: user.date,
    slikaKorisnika: user.slikaKorisnika,
    lastConnection: user.lastConnection
  });
})
});
// res.render("profile", {
//   name: req.user.name,
//   email:req.user.email,
//   date: req.user.date,
//   slikaKorisnika: req.user.slikaKorisnika,
//   lastConnection: req.user.lastConnection
// });
//http://localhost:3000/VratiSveKorisnike
router.get("/VratiSveKorisnike", ensureAuthenticated, (req, res) => {
  User.find({ name: { $ne: "admin" } }).then((users) => {
    res.render("korisnici", {
      users: users,
      name: req.user.name,
      lastConnection: req.user.lastConnection
    });
  });
});
//vrati samo odigrane partije
//https://localhost:3000/OdigranePartije
router.get("/OdigranePartije", async (req,res) =>{ 
  let vratiListu = [];
  let odigraneIgre = [];
  
  const games = await Game.find();
    const start = async () => {
      await asyncForEach(games, async (game) => {
        if (req.user._id.equals(game.igraci[0])){
          if (game.igraci[1] != null) {
            console.log('if game.igraci[1] ' + game.igraci[1] + ' game.igraci[0] ' + game.igraci[0]);
            const user = await User.findOne({_id : ObjectId(game.igraci[1])});
            console.log(user);
            if(user != null){
            vratiListu.push(user);
            odigraneIgre.push(game);}
          }
        }
        else if (req.user._id.equals(game.igraci[1])){
          console.log('if game.igraci[0] ' + game.igraci[0] + 'game.igraci[1] ' + game.igraci[1]);
          const user =  await User.findOne({_id: ObjectId(game.igraci[0])});
          console.log(user);
          if(user != null){
          vratiListu.push(user);
          odigraneIgre.push(game);}
        };
      });
      res.render("odigranepartije", {users: vratiListu, games: odigraneIgre});
    }
    start();
}); 
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
module.exports = router;