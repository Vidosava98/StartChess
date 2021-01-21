const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Figura = require("../models/Figura");
const passport = require("passport");



// Unesi podatke jedne figure hardkodirano
//http://localhost:3000/figura/unesipodatke
router.post("/unesipodatke", (req, res) => {
    const figura = new Figura({
      name: "Konj",
      color: "white", //white ili black, zbog razlicitosti padeza
      slika: "slika", // najver mora da se radi multer i da prilikom kreiranja dobiju slike iz foldera slikeFigura
      pozicijaNaTabli:"(1,B)"
    });
    const sacuvajfiguru = figura.save();
    res.json(sacuvajfiguru);
    console.log("Uspesno ste kreirali figuru");
   });

 //Unesi poziciju figure
//http://localhost:3000/figura/unesipozicijufigure/6004786a7eea1941708a96df/(G,7)
//PRENOSI SE PREKO stranice, tj kao potez korisnika, u zavisnosti koju figuru odabere i 
//koje polje izabere da postavi figuru
router.post("/unesipozicijufigure/:id/:novaPozicija", (req, res) => {

    Figura.findById(req.params.id)
    .then((figura) => {
      if (figura != null) {
        figura.pozicijaNaTabli=req.params.novaPozicija;
        res.json(figura);
        figura.save();
      } else {
        res.send("Ne postoji figura sa tim id-em");
      }
    })
    .catch((err) => console.log(err));
 });


//vrati sve figure
//http://localhost:3000/figura/vratisvefigure
router.get("/vratisvefigure", (req, res) => {
    Figura.find().then((figure) => {
      res.json(figure);
    });
  });

  //vrati figure po boji
  //http://localhost:3000/figura/vratifigure
  router.get("/vratifigure", (req, res) => {
    Figura.findOne({color:"bela"})
      .then((figure) => {
        
        if (figure != null) {
         res.json(figure);
        } else {
          res.send("Nema figura");
        }
      })
      .catch((err) => console.log(err));
  });
  //vrati figure po boji
//http://localhost:3000/figura/vratifigure/white
//http://localhost:3000/figura/vratifigure/black
  router.get("/vratifigure/:color", (req, res) => {
    Figura.findOne({color:req.params.color})
      .then((figure) => {
        
        if (figure != null) {
         res.json(figure);
        } else {
          res.send("Nema figura sa tom bojom");
        }
      })
      .catch((err) => console.log(err));
  });
  //izbrisi figuru
//http://localhost:3000/figura/delete/600486a157b3a835a46ce95c
//http://localhost:3000/figura/delete/6005b7857203c93b70b24259
router.post("/delete/:id", (req, res) => {
  Figura.findByIdAndDelete( {_id : req.params.id},function (err, result) {
    if (err) {
      res.send("Dogodio se izuzetak");
    } else {
     console.log("Izbrisana figura");
    }
  } );
});

//vrati korisnika sa odredjenim id-em
//http://localhost:3000/figura/figurapoid/600486a157b3a835a46ce95c

router.get("/figurapoid/:id", (req, res) => {
  Figura.findById(req.params.id)
    .then((figura) => {
      
      if (figura != null) {
       res.json(figura);
      } else {
        res.send("Nema figure sa tim id-em");
      }
    })
    .catch((err) => console.log(err));
});

   module.exports = router;