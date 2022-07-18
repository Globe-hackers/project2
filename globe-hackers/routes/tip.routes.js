const router = require("express").Router();
const Tip = require("../models/Tip.model");

// Details of a tip
router.get("/tip-details", (req, res, next) => {
  Tip.find()
  .then( () => {
    res.render("tips/tip-details")
  })
  .catch( error => {
    console.log("error getting the list of tips from DB", error)
  })
});

// Create a tip - GET
router.get("/create", (req, res, next) => {
  res.render("tips/tip-create");
});

// Create a tip - POST
router.post("/create", (req,res,next) => {
   
  const tipDetails = {   
      country: req.body.country,
      city: req.body.city,
      category: req.body.category,
      description: req.body.description,
  }

Tip.create(tipDetails)
  .then( () => {
      res.redirect("/tips");
  })
  .catch( (error) => {
      console.log("Error creating a tip in DB", error);
      next(error);
    })
})


module.exports = router;
