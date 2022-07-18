const router = require("express").Router();
const Tip = require("../models/Tip.model");

//View list of all the tips
router.get("/", (req, res, next) => {
  Tip.find()
    .then((tips) => {
      const data = {
        tipsArr: tips,
      };
      res.render("tips/tips-list", data);
    })
    .catch((error) => {
      console.log("Error getting data from DB", error);
      next(error);
    })
});

// Details of a tip
router.get("/tip/:tipId", (req, res, next) => {
  Tip.findById(req.params.tipId)
    .then((tip) => {
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
    .then(() => {
      console.log("posting")
      res.redirect("/tips")
    })
    .catch((error) => {
      console.log("Error creating tip in the DB", error);
      next(error);
    })
});

//Update a tip - GET
router.get("/:tipId/edit", (req, res, next) => {
  const tipId = req.params.tipId;
  Tip.findById(tipId)
    .then( (tipDetails) => {
      res.render("tips/tip-update", tipDetails);
    })
    .catch( (error) => {
      console.log("Error getting tip details from DB", error);
      next(error);
    })
});

//Update a tip - POST
router.post("/:tipId/edit", (req, res, next) => {
  const tipId = req.params.tipId;
  const newDetails = {
    country: req.body.country,
    city: req.body.city,
    category: req.body.category,
    description: req.body.description,
  };
  Tip.findByIdAndUpdate(tipId, newDetails)
    .then( () => {
      res.redirect("/tips");
    })
    .catch( (error) => {
      console.log("Error updating tip in DB", error);
      next(error);
    })
});

module.exports = router;
