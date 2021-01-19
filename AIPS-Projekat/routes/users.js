const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Figura = require("../models/Figura");
const passport = require("passport");

//vrati sve korisnike
//http://localhost:3000/users/vratisvekorisnike
router.get("/vratisvekorisnike", (req, res) => {
  User.find().then((users) => {
    res.json(users);
  });
});



//vrati korisnika sa odredjenim id-em
//http://localhost:3000/users/korisnikpoid/6004894e3ab64056685ce99c
router.get("/korisnikpoid/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      
      if (user != null) {
       res.json(user);
      } else {
        res.send("Nema korisnika sa tim id-em");
      }
    })
    .catch((err) => console.log(err));
});
//vrati korisnika po emailu
//http://localhost:3000/users/korisnikSaMailom
router.get("/korisnikSaMailom", (req, res) => {
  User.findOne({email:"maja99@gmail.com"})
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
//http://localhost:3000/users/korisnikSaImenom
router.get("/korisnikSaImenom",(req,res)=>{
  User.findOne({name:"Maja"})
  .then((user)=>
  {
    if(user!=null)
    {res.json(user);}
    else
    {res.send("Nema korisnika sa tim emailom");}
    
  })
  .catch((err)=>console.log(err));
});


// Kreiraj Usera(Hard kodirano)
// http://localhost:3000/users/kreirajUsera
//preko POSTMAN-A
router.post("/kreirajUsera", (req, res) => {
 const user = new User({
   name: "Tinaa",
   email:"tina@gmail.com",
   password:"tinaa99",
   slikaKorisnika:"null"
 });
 const sacuvajuser = user.save();
 res.json(sacuvajuser);
});

// Unesi podatke u toku igre, odnosno figure i boju igraca
// http://localhost:3000/users/updateUser/6004cda827cb95527c6e66a8/white/6005bb52223eeb0b64c76d4f
//preko POSTMAN-A
router.post("/updateUser/:iduser/:boja/:idfigure", (req, res) => {
  var figura = new Figura({_id: req.params.idfigure});
  User.findById(req.params.iduser)
  .then((user) => {
    if (user != null) {
      user.figure.push(figura);
      user.color=req.params.boja;
      const sacuvajuser = user.save();
      res.json(sacuvajuser);
    } else {
      res.send("Ne user sa tim id-em");
    }
  })
  .catch((err) => console.log(err));
  
 });



//kreiraj korisnika unosom parametra
//http://localhost:3000/users/kreirajUsera/Jana/jana99@gmail.com/jana99
//preko POSTMANA
router.post("/kreirajUsera/:ime/:email/:sifra", (req, res) => {
  const user = new User({
    name: req.params.ime,
    email: req.params.email,
    password: req.params.sifra
  });
  const sacuvajuser = user.save();
  res.json(sacuvajuser);
 });



 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
  User.findOne({ name: req.bodz.name })
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

 router.post("/registracija", (req, res) => {
 
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
     errors.push({ msg: "Popunite sve podatke." });
   }

  if (password !== password2) {
    errors.push({ msg: "Sifre se ne poklapaju" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Sifra mora biti duza od 6 karaktera" });
  }

  if (errors.length > 0) {
    res.render("registracija", {
      errors,
      name,
      email,
      password,
      password2,
      slikaKorisnika,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Vec postoji korisnik sa tim emailom." });
        res.render("registracija", {
          errors,
          name,
          email,
          password,
          password2,
          // slikaKorisnika,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        
        });
        //U ovom delu se  nekako sifra pretvara u bycript
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "Uspesno ste se registrovali.");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Uspesno ste se odjavili.");
  res.redirect("/users/login");
});



router.post("/changepassword", (req, res, next) => {
  const { passwordchange, passwordchange2, passwordchange3 } = req.body;
  var id;
  let errors = [];
  User.findOne({ name: req.body.name }).then((user) => {
    bcrypt.compare(passwordchange, user.password, (err, isMatch) => {
      if (err) {
        req.flash("error_msg", "Doslo je do greske prilikom promene lozinke.");
        res.redirect("/users/profile");
        return;
      }
      if (isMatch) {
        if (passwordchange2 !== passwordchange3) {
          req.flash("error_msg", "Unete sifre se ne poklapaju.");
          res.redirect("/users/profile");
          return;
        }
        if (passwordchange2.length < 6) {
          req.flash("error_msg", "Nova sifra mora biti duza od 6 karaktera.");
          res.redirect("/users/profile");
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
                res.redirect("/users/profile");
                return;
              } else {
                req.flash("success_msg", "Uspešna promena lozinke!!!");
                res.redirect("/users/profile");
                return;
              }
            })
          )
        );
      } else {
        req.flash("error_msg", "Trenutna šifra koju ste uneli nije tačna.");
        res.redirect("/users/profile");
        return;
      }
    });
  });
});

router.post("/changeusername", (req, res, next) => {
  const { namechange } = req.body;
  console.log(namechange);
  var id;
  let errors = [];
  User.findOne({ name: namechange }).then((user) => {
    console.log(user);
    if (!user) {
      User.findOne({ name: req.body.name }).then((user) => {
        id = user._id;
        User.findByIdAndUpdate({ _id: id }, { name: namechange }, function (
          err,
          result
        ) {
          if (err) {
            console.log("Greška");
            res.redirect("/users/profile");
            return;
          } else {
            console.log("Uspešno");
            res.redirect("/users/profile");
            return;
          }
        });
      });
    } else {
      res.redirect("/users/profile");
      return;
    }
  });
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
