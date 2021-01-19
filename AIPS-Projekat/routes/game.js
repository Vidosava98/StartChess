const express = require("express");
const router= express.Router();
const Game = require("../models/Game");
const User = require("../models/User");
const Chat = require("../models/Chat");


//POKRENI NOVU PARTIJU , FIKSNI PODACI, 16 BELIH, 16 CRNIH I 32 UKUPNO
//http://localhost:3000/game/pokreniPartiju
//PREKO Postman-a
router.post("/pokreniPartiju", (req,res)=>
{
    const partija= new Game({
        result:"nema",
        numbersOfFigure:"32",
        kraj: false
    });
    const sacuvanaPartija = partija.save();
    res.json(sacuvanaPartija);

});

//Izbrisi partijuu
//http://localhost:3000/game/delete/
router.post("/delete/:id", (req, res) => {
  Game.findByIdAndDelete( {_id : req.params.id},function (err, result) {
    if (err) {
      res.send("Dogodio se izuzetak");
    } else {
     console.log("Izbrisana partija");
    }
  } );
});

//POKRENI NOVU PARTIJU ,Sa Korisnicima, FIKSNI PODACI, 16 BELIH, 16 CRNIH I 32 UKUPNO
//http://localhost:3000/game/pokreniIgru/600488249fd82214fc6b3f6f/6004cda827cb95527c6e66a8
//PREKO Postman-a
router.post("/pokreniIgru/:id1/:id2", (req,res)=>
{
    var user1 = new User({_id: req.params.id1});
    var user2 = new User({_id: req.params.id2});
    var partija= new Game({
        result:"Nema rezultata jos uvek",
        kraj: false
    });
    partija.igraci.push(user1);
    partija.igraci.push(user2);
    const sacuvanaPartija = partija.save();
    res.json(sacuvanaPartija);

});

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
//http://localhost:3000/game/unesiPodatkeIgreIChet/6005e826651aa547c84b1466/6005b4561defb355b4137159
//PREKO Postman-a
//U toku igre, igra ce biti pokrenuta i znamo njen id, zatim kad se kreira poruka, pomocu ove post metode, 
//sadrzaj te poruke treba da bude zapamcen u okviru poruka te igre
router.post("/unesiPodatkeIgreIChet/:idPartije/:idChet", (req,res)=>
{
    var poruke = new Chat({_id: req.params.idChet});

    Game.findById(req.params.idPartije)
    .then((partija) => {
      if (partija != null) {
        partija.porukeIgre.push(poruke);
        const sacuvanaPartija = partija.save();
        res.json(sacuvanaPartija);
      } else {
        res.send("Ne postoji partija sa tim id-em");
      }
    })
    .catch((err) => console.log(err));
    

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
//http://localhost:3000/game/unesiIgru/7/10/pobednikdrugi/17
//PREKO Postman-a
router.post("/unesiIgru/:beli/:crni/:rezultat/:brojfigura", (req,res)=>
{
    const partija= new Game({
        white:req.params.beli,
        black:req.params.crni,
        result:req.params.rezultat,
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

//Vrati Partiju 
//http://localhost:3000/game/vratiPartiju/6005e826651aa547c84b1466

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