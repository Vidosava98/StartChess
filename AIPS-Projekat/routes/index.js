const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const Game = require("../models/Game");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const puppeteer = require('puppeteer');
//var popup = require('popups');
// const browserData = puppeteer.launch();
// const page = browserData.newPage();

module.exports = run = async () => {
  const url = 'https://example.com';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //await page.goto(url);
  return page;
};
// (async () => {
//   const browser = await run(); 
// })();
//const { StrictEventEmitter } = require("socket.io/dist/typed-events");
//const countDown = document.getElementById('idCountDown');
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
router.post("/VratiPodatkePartije", async (req,res) =>{
    // Game.findOne({ kraj: false })
    // .then(async (game) => {
    //   if(game.igraci.length == 1)
    //   {
    //   game.igraci.push(req.user._id);
    //   game.kraj = true;
    //   await game.save();
    //   var hh = game.datumKreiranjaIgre.getHours();
    //   var mm = game.datumKreiranjaIgre.getMinutes();
    //    hh = hh < 10 ? '0' + hh : hh; 
    //    mm = mm < 10 ? '0' + mm : mm;
    //   let  curr_time = hh + ':' + mm;
    //   User.find({ $or: [{_id:game.igraci[0]},{ _id:game.igraci[1]}] }).then((igraci) => {
    //     console.log("U if sam");
    //     res.render("partija", {
    //       igraci: igraci,
    //       game:  game,
    //       vreme: curr_time,
    //       timer:0,
    //       popup:false
    //     });
    //   });
    //   } else{
    //     User.find({ $or: [{_id:game.igraci[0]},{ _id:game.igraci[1]}] }).then((igraci) => {
    //       console.log("U else sam");
    //       res.render("partija", {
    //         igraci: igraci,
    //         game:  game,
    //         vreme: curr_time,
    //         timer:0,
    //         popup:false
    //       });
    //     });
    //   }
    // })
    // .catch(async (err) => {
    //   console.log("U catch sam");
    //   var partija= new Game({
    //       result:"Nema rezultata jos uvek",
    //       kraj: false,
    //   });
    //   debugger;
    //   partija.igraci.push(req.user._id);
    //   //Treba da se igracu izmene neki atributi, npr treba da se doda koje je boje,bela ili crna
    //   const sacuvanaPartija = await partija.save();
    //   //console.log(sacuvanaPartija);
    //   //Treba da se napravi jedna provera koja ce da ceka da jos neko doda svoj id u tu partiju
    //   setInterval(async ()=>{
    //     Game.findOne({ kraj: false })
    //     .then((game) => {
    //        console.log('length:' + game.igraci.length);
    //        res.render("partija", {
    //         igraci: [req.user],
    //         game:  new Game({ result:"Ceka se drugi takmicar",
    //         kraj: false}),
    //         vreme: 0,
    //         timer:0,
    //         popup: true
    //       });
    //     }) 
    //     .catch(async() =>{
    //         var partijaIsta = await Game.findOne({_id : partija._id});
    //         console.log('U catch 2 sam');
    //         User.find({ $or: [{_id:partijaIsta.igraci[0]},{ _id:partijaIsta.igraci[1]}] }).then((igraci) => {
    //           var hh = partijaIsta.datumKreiranjaIgre.getHours();
    //           var mm = partijaIsta.datumKreiranjaIgre.getMinutes();
    //            hh = hh < 10 ? '0' + hh : hh; 
    //            mm = mm < 10 ? '0' + mm : mm;
    //           let  curr_time = hh + ':' + mm;
    //           console.log(curr_time);
    //           res.render("partija", {
    //             igraci: igraci,
    //             game:  partijaIsta,
    //             vreme: curr_time,
    //             timer:0,
    //             popup: false
    //           });
    //         });
    //       })        
    //   },30000)     
    // });
    //console.log(req.body['room']);
    res.render("partija", {
      igrac: req.user,
      game:  new Game({ result:"Ceka se drugi takmicar",
      kraj: false}),
      vreme: 0,
      timer:0,
      room: req.body['room'],
      email: req.user.email
    });
});
//http://localhost:3000/VratiProfil
router.get("/VratiProfil", ensureAuthenticated, (req, res) => {
console.log(req.body);
User.findById(req.user._id).then((user) =>{
  let avatar = null;
  if(user.avatar != null) {avatar = user.avatar.toString('base64');}
  res.render("profile", {
    name: user.name,
    email:user.email,
    date: user.date,
    slikaKorisnika: user.slikaKorisnika,
    lastConnection: user.lastConnection,
    avatar: avatar
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
  
  const games = await Game.find().sort('-datumKreiranjaIgre');
    const start = async () => {
      await asyncForEach(games, async (game) => {
        if (req.user._id.equals(game.igraci[0])){
          if (game.igraci[1] != null) {
            console.log('if game.igraci[1] ' + game.igraci[1] + ' game.igraci[0] ' + game.igraci[0]);
            const user = await User.findOne({_id : ObjectId(game.igraci[1])});
            console.log(game);
            if(user != null){
            vratiListu.push(user);
            odigraneIgre.push(game);}
          }
        }
        else if (req.user._id.equals(game.igraci[1])){
          console.log('if game.igraci[0] ' + game.igraci[0] + 'game.igraci[1] ' + game.igraci[1]);
          const user =  await User.findOne({_id: ObjectId(game.igraci[0])});
          console.log(game);
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
router.get("/zapocniPartiju", async(req,res) =>{
  res.render("joinpart");
});

module.exports = router;