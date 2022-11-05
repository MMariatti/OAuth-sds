const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
///Callback route for google to redirect
router.get(
  "/google/redirect",
  passport.authenticate("google"),
  (req, res, next) => {
    user = req.user;
    body = { "Nombre": user.name, "Email": user.email};
    res.status(200).send(body);
  }
);
module.exports = router;