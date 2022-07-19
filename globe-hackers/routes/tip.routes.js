const router = require("express").Router();
const Tip = require("../models/Tip.model");
const User = require("../models/User.model");

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
      console.log(tip)
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
  const newDetails = {
    country: req.body.country,
    city: req.body.city,
    category: req.body.category,
    description: req.body.description,
  };
  Tip.findByIdAndUpdate(req.params.tipId, newDetails)
    .then( () => {
      res.redirect("/tips");
    })
    .catch( (error) => {
      console.log("Error updating tip in DB", error);
      next(error);
    })
});

//Delete - POST
router.post("/:tipId/delete", (req, res, next) => {
  Tip.findByIdAndRemove(req.params.tipId)
    .then( () => {
      res.redirect('/tips');
    })
    .catch( (error) => {
      console.log("Error deleting tip from DB", error);
      next(error);
    })
})

// Add favourite - POST
router.post("/:tipId/favourite", (req, res, next) => {
  const newFavourite = {
    favourites : req.params.tipId
  }
  User.findByIdAndUpdate(req.session.user, newFavourite, {new:true})
    .then( (user) => {
      console.log(user)
      res.redirect('/profile');
    })
    .catch( (error) => {
      console.log("Error adding tip as favourite", error);
      next(error);
    })
})

module.exports = router;
