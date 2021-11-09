// const express= require("express");
// const { $where } = require("../models/Chat");
// const router = express.Router();
// const Chat = require("../models/Chat");
const express= require("express");
const router = express.Router();
const Chat = require("../models/Chat");


// "socket.io": "^3.1.1"


//Unesi poruku korisnika
//http://localhost:3000/chat/unesiPoruku
router.post("/unesiPoruku",(req,res)=>
{
const Poruka = new Chat({
    playerName:"Jana",
    playerId: "60049ca2fb226326dc557b1a",
    message: "Saljem trecu poruku"
});
const sacuvanaPoruku = Poruka.save();
res.json(sacuvanaPoruku);
console.log("Uspesno ste poslali poruku");
});

//Vrati sve poruke jednog korisnika  hardokidarno
//http://localhost:3000/chat/vratiPoruku/Jana
router.get("/vratiPoruku/:name",(req,res)=>{
Chat.find({playerName:req.params.name})
.then((chat)=>{
    if(chat!= null){
     res.json(chat);
    } else {
        res.send("Ovaj korisnik nije slao poruke");
    } 
})
.catch((err)=>console.log(err));
});

//Vrati sve poruke jednog korisnika 
//http://localhost:3000/chat/vratiPorukuKorisnika/60049ca2fb226326dc557b1a
//http://localhost:3000/chat/vratiPorukuKorisnika/6004cda827cb95527c6e66a8
router.get("/vratiPorukuKorisnika/:id",(req,res)=>{
    Chat.find({playerId:req.params.id})
    .then((chat)=>{
        if(chat != null){
         res.json(chat);
        } else {
            res.send("Korisnik sa ovim idem jos uvek nije slao poruke");
        } 
    })
    .catch((err)=>console.log(err));
    });

// router.get("/", (req,res) =>{
//     var socket = io.connect('http://localhost:3000');
//     console.log("Usla sam u post kod chat");
// })
module.exports =router;