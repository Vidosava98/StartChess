const express= require("express");
const router = express.Router();

router.get("/_form_changepassword", (req, res) => {
    res.render("_form_changepassword", {
      name: req.user.name,
    });
  });
  router.get("/_form_changeusername", (req, res) => {
    res.render("_form_changeusername", {
      name: req.user.name,
    });
  });

module.exports = router;