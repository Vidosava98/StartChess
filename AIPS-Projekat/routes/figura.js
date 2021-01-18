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
      slika: "slika", //mora da se radi multer i da prilikom kreiranja dobiju slike iz foldera slikeFigura
      pozicijaNaTabli:"(1,B)"
    });
    const sacuvajfiguru = figura.save();
    res.json(sacuvajfiguru);
    console.log("Uspesno ste kreirali figuru");
   });
///
router.post("/unesi/:ime/:boja", (req, res) => {
    const figura = new Figura({
      name: req.params.ime,
      color: req.params.boja
    });
    const sacuvajfiguru = figura.save();
    res.json(sacuvajfiguru);
   
   });
//vrati sve figure
router.get("/vratisvefigure", (req, res) => {
    Figura.find().then((figure) => {
      res.json(figure);
    });
  });
  //vrati figure
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
   module.exports = router;