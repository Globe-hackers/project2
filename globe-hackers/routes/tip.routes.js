const router = require("express").Router();
const Tip = require("../models/Tip.model");

// Details of a tip
router.get("/tip/:tipId", (req, res, next) => {
  Tip.findById(req.params.tipId)
    .then((tip) => {
      console.log(tip);
      res.render("tips/tip-details", tip)
    })
    .catch(error => {
      console.log("error getting the list of tips from DB", error)
    })
});

// Create a tip - GET
router.get("/create", (req, res, next) => {
  res.render("tips/tip-create");
});

// Create a tip - POST
router.post("/create", (req, res, next) => {

  const tipDetails = {
    country: req.body.country,
    city: req.body.city,
    category: req.body.category,
    description: req.body.description,
  };
  Tip.create(tipDetails)
  .then( () => {
    console.log("posting")
    res.redirect("/"); //À changer pour la page de list des tips
  })
  .catch( (error) => {
    console.log("Error creating tip in the DB", error);
    next(error);
  })
});


module.exports = router;
