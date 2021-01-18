const express = require("express");
const router= express.Router();
const Game = require("../models/Game");
const User = require("../models/User");

//POKRENI NOVU PARTIJU , FIKSNI PODACI, 16 BELIH, 16 CRNIH I 32 UKUPNO
//http://localhost:3000/game/unesiPodatkeIgre
//PREKO Postman-a
router.post("/unesiPodatkeIgre", (req,res)=>
{
    const partija= new Game({
        white:"16",
        black:"16",
        result:"nema",
        numbersOfFigure:"32"
    });
    const sacuvanaPartija = partija.save();
    res.json(sacuvanaPartija);

});

//POKRENI NOVU PARTIJU , FIKSNI PODACI, 16 BELIH, 16 CRNIH I 32 UKUPNO
//http://localhost:3000/game/unesiPodatkeIgre/10/11/nema/21
//PREKO Postman-a
router.post("/unesiPodatkeIgre/:beli/:crni/:rezultat/:brojfigura", (req,res)=>
{
    const partija= new Game({
        white:req.params.beli,
        black:req.params.crni,
        result:req.params.rezultat,
        numbersOfFigure:req.params.brojfigura
    });
    const sacuvanaPartija = partija.save();
    res.json(sacuvanaPartija);

});

//POKRENI NOVU PARTIJU , FIKSNI PODACI, 16 BELIH, 16 CRNIH I 32 UKUPNO
//http://localhost:3000/game/unesiIgru/7/10/pobednikdrugi/17/5ff667ea963e304908967f1a/5ff8c832cf127d5ec0069da1
//PREKO Postman-a
router.post("/unesiIgru/:beli/:crni/:rezultat/:brojfigura/:id1/:id2", (req,res)=>
{
    const partija= new Game({
        white:req.params.beli,
        black:req.params.crni,
        result:req.params.rezultat,
        igrac1:req.params.id1,
        igrac2: req.params.id2,
        numbersOfFigure:req.params.brojfigura,
        kraj:false
    });
    console.log("Uspesno ste uneli podatke partije");
    const sacuvanaPartija = partija.save();
    res.json(sacuvanaPartija);

});
//Vrati podatke partije
//http://localhost:3000/game/vratiPartiju/6004be1158144f1bdc0fade5

router.get("/vratiPartiju/:id",(req,res)=>
{
    Game.findById(req.params.id)
      .then((partija) => {
        if (partija != null) {
         res.json(partija);
        } else {
          res.send("Ne postoji partija sa tim id-em");
        }
      })
      .catch((err) => console.log(err));
    
});




module.exports = router;