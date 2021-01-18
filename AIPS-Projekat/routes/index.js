const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");


router.get("/", (req, res) => {
  res.render("welcome");
}); 
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
});

router.get("/users/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    name: req.user.name,
    email: req.user.email,
    date: req.user.date,
    slikaKorisnika: req.user.slikaKorisnika
  });
});

//http://localhost:3000/users/korisnici
router.get("/users/korisnici", ensureAuthenticated, (req, res) => {
  User.find({ name: { $ne: "admin" } }).then((users) => {
    res.render("korisnici", {
      users: users,
      name: req.user.name,
    });
  });
});

module.exports = router;
