const router = require("express").Router();
const Tip = require("../models/Tip.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");

const isLoggedIn = require("../middleware/isLoggedIn");

// View profile page - GET
router.get("/profile", isLoggedIn, (req, res, next) => {
    console.log(req.session.user)
    User.findById(req.session.user._id)
    .populate("favourites")
      .then((user) => {
        console.log(user)
        res.render("user/profile", user);
      })
      .catch((error) => {
        console.log("Error loading profile information", error);
        next(error);
      })
  });

module.exports = router;