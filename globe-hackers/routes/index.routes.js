const router = require("express").Router();
const Tip = require("../models/Tip.model");

/* GET home page */
router.get("/", (req, res, next) => {
  Tip.find().sort({ createdAt: -1 }).limit(1)
    .then((found) => {
      res.render("index", { found })
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router;
