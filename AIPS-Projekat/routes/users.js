const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Figura = require("../models/Figura");
const passport = require("passport");
const multer = require('multer');
//vrati sve korisnike

const upload = multer({
  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        console.log(file.originalname);
          return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)
  }
})
//http://localhost:3000/users/vratisvekorisnike
router.get("/vratisvekorisnike", (req, res) => {
  User.find().then((users) => {
    res.json(users);
  });
});
//vrati korisnika sa odredjenim id-em
//http://localhost:3000/users/korisnikpoid/618ad848fe0b5c47b01fb53b
router.get("/korisnikpoid/:id", (req, res) => {
  console.log('body.baseUrl: ' + req.baseUrl);
  console.log('req.params ' + req.params.id);
  console.log('req.body.value ' + req.body);
  res.end();
  // User.findById(req.params.id)
  //   .then((user) => {      
  //     if (user != null) {
  //      res.json(user);
  //     } else {
  //       res.send("Nema korisnika sa tim id-em");
  //     }
  //   })
  //   .catch((err) => console.log(err));
});
//vrati korisnika po emailu
//http://localhost:3000/users/korisnikSaMailom/
router.get("/korisnikSaMailom", (req, res) => {
  User.findOne({email:"arsic.vida@gmail.com"})
    .then((user) => {    
      if (user != null) {
       res.json(user);
      } else {
        res.send("Nema korisnika");
      }
    })
    .catch((err) => console.log(err));
});
//Vraca json podatke korisnika sa imenom(hardkodirano)
//http://localhost:3000/users/korisnikSaImenom/
router.get("/korisnikSaImenom",(req,res)=>{
  User.findOne({name:"vida98"})
  .then((user)=> {
    if(user!=null)
    {res.json(user);}
    else
    {res.send("Nema korisnika sa tim imenom");}   
  })
  .catch((err)=>console.log(err));
});
// Kreiraj Usera(Hard kodirano)
// http://localhost:3000/users/kreirajUsera
//preko POSTMAN-A
router.get("/kreirajUsera", (req, res) => {
 const user = new User({
   name: "Vidosava Arsic",
   email:"vidosava123@gmail.com",
   password:"vidosava123"
 });
 const sacuvajuser = user.save();
 //Iako radim upis u bazu, neophodno je da bude router.get
 res.json(sacuvajuser);
});

// Unesi podatke u toku igre, odnosno figure i boju igraca
// http://localhost:3000/users/updateUser/64b8370c6b879a2618e73782/white/6005bb52223eeb0b64c76d4f
//preko POSTMAN-A
router.get("/updateUser/:iduser/:boja/:idfigure", (req, res) => {
  var figura = new Figura({_id: req.params.idfigure});
  User.findById(req.params.iduser)
  .then((user) => {
    if (user != null) {
      user.figure.push(figura);
      user.color=req.params.boja;
      const sacuvajuser = user.save();
      console.log(figura);
      res.json(sacuvajuser);
    } else {
      res.send("Nema user-a sa tim id-em");
    }
  })
  .catch((err) => console.log(err));
 });
//kreiraj korisnika unosom parametra
//http://localhost:3000/users/kreirajUsera/Milos/milos1999@gmail.com/milos1999
//preko POSTMANA
router.get("/kreirajUsera/:ime/:email/:sifra", (req, res) => {
  const user = new User({
    name: req.params.ime,
    email: req.params.email,
    password: req.params.sifra
  });
  const sacuvajuser = user.save();
  res.json(sacuvajuser);
 });
 //Update za sliku, tj da se doda slika za usera naknadno
 // http://localhost:3000/users/addImage/655a30036e6a78329cc2a3db
 router.get("/addImage/:id", upload.single('avatar'), async (req,res) => {
  try{
  const id = req.params.id;
  console.log(id);
  console.log(req.file.buffer);
  const user =  await User.findOneAndUpdate({_id : id},{avatar : req.file.buffer},function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Updated User : ", docs); 
    } 
});
  console.log(user);
  res.send();
  }
  catch(err)
  {
    res.status(404).send("Ovde je greska" + err);
  }
 },(error,req,res,next) => {res.status(400).send(error.messasge);})

//Login page
router.get("/login", (req, res) => {
  res.render("login");
});
//Register page
router.get("/registracija", (req, res) => {
  res.render("registracija");
});
router.get("/profilkorisnika", (req, res) => {
  res.render("profilkorisnika");
});
router.post("/profilkorisnika", (req, res) => {
  User.findOne({ name: req.body.name })
    .then((user) => {
      console.log(user);
      if (user == null) {
        res.redirect("/dashboard");
      } else {
        res.render("profilkorisnika", {
          user: user,
        });
      }
    })
    .catch((err) => console.log(err));
});
//Register
 router.post("/registracija", upload.single('avatar'), async (req, res) => {

  const { name, email, password, password2,avatar} = req.body;
  const avatarBuff = req.file.buffer;
  let errors = [];
  //u req.file.buffer ide ono sto vrati middleware metoda, odnosno slika u binarnom obliku
  if (!name || !email || !password || !password2) {
     errors.push({ msg: "Popunite sve podatke." });
   }

  if (password !== password2) {
    errors.push({ msg: "Sifre se ne poklapaju" });
  }

  if (password?.length < 6) {
    errors.push({ msg: "Sifra mora biti duza od 6 karaktera" });
  }
  if (errors?.length > 0){
    res.render("registracija", {
      errors,
      name,
      email,
      password,
      password2,
      avatar
    });
   } else {
    User.findOne({ email: email })
    .then((user) => {
      if (user) {
        errors.push({ msg: "Vec postoji korisnik sa tim emailom." });
        console.log(name);
        console.log(avatar);
        res.render("registracija", {
          errors,
          name: name,
          email,
          password,
          password2,
          avatar,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          avatar:avatarBuff
        });
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            //console.log(newUser.password);
            //console.log(salt);
            if (err) {
              throw err;
            }
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "Uspesno ste se registrovali.");
                console.log(user);
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});
router.post("/logovanje", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});
router.get("/logout", (req, res, next) => {
  req.logout(function(err){
    if(err)
    { 
      return req.next(err);
    }
    else{     
      res.redirect("/users/login");
    }
  });
  req.flash("success_msg", "Uspesno ste se odjavili.");
});
router.post("/changepassword", (req, res, next) => {
  const { passwordchange, passwordchange2, passwordchange3 } = req.body;
  var id;
  let errors = [];
  User.findOne({ name: req.body.name }).then((user) => {
    bcrypt.compare(passwordchange, user.password, (err, isMatch) => {
      if (err) {
        req.flash("error_msg", "Doslo je do greske prilikom promene lozinke.");
        res.redirect("/VratiProfil");
        return;
      }
      if (isMatch) {
        if (passwordchange2 !== passwordchange3) {
          req.flash("error_msg", "Unete sifre se ne poklapaju.");
          res.redirect("/VratiProfil");
          return;
        }
        if (passwordchange2?.length < 6) {
          req.flash("error_msg", "Nova sifra mora biti duza od 6 karaktera.");
          res.redirect("/VratiProfil");
          return;
        }
        id = user._id;
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(passwordchange2, salt, (err, hash) =>
            User.findByIdAndUpdate({ _id: id }, { password: hash }, function (
              err,
              result
            ) {
              if (err) {
                req.flash(
                  "error_msg",
                  "Došlo je do greške prilikom promene lozinke."
                );
                res.redirect("/VratiProfil");
                return;
              } else {
                req.flash("success_msg", "Uspešna promena lozinke!!!");
                res.redirect("/VratiProfil");
                return;
              }
            })
          )
        );
      } else {
        req.flash("error_msg", "Trenutna šifra koju ste uneli nije tačna.");
        res.redirect("/VratiProfil");
        return;
      }
    });
  });
});
router.post("/changeusername", (req, res, next) => {
  const { namechange } = req.body;
  var id;
  let errors = [];
  User.findOne({ name: namechange }).then((user) => {
    if (!user) {
      User.findOne({ name: req.body.name }).then((user) => {
        id = user._id;
        User.findByIdAndUpdate({ _id: id }, { name: namechange }, function (
          err,
          result
        ) {
          if (err) {
            req.flash("error_msg", "Doslo je do greske prilikom promene imena.");
            res.redirect("/VratiProfil");
            return;
          } else {
            req.flash("success_msg", "Uspešna promena imena!!!");
            res.redirect("/VratiProfil");
            return;
          }
        });
      });
    } else {
      req.flash("error_msg", "Doslo je do greske prilikom promene profilne slike.");
      res.redirect("/VratiProfil");
      return;
    }
  });
});
router.post("/changeProfileImage", upload.single('avatar'), async (req,res) => {
  try{
  const email = req.body.email;
  console.log(req.file.buffer);
  const user =  await User.findOneAndUpdate({email : email},{avatar : req.file.buffer},function (err,result) {
    if (err) {
      req.flash("error_msg", "Doslo je do greske prilikom promene profilne slike.");
      res.redirect("/VratiProfil");
      return;
    }else{
      req.flash("success_msg", "Uspešna promena profilne slike!!!");
      res.redirect("/VratiProfil");
      return;
    }
  });
  }
  catch(err)
  {
    req.flash("error_msg", "Doslo je do greske prilikom promene profilne slike.");
    res.redirect("/VratiProfil");
  }
 },(error,req,res,next) => {  
 req.flash("error_msg", "Doslo je do greske prilikom promene profilne slike.");
 res.redirect("/VratiProfil");
 });
router.post("/delete", (req, res) => {
  console.log(req.body);
  User.findByIdAndDelete({ _id: req.body.id }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.redirect(req.get("referer"));
    }
  });
});

module.exports = router;
