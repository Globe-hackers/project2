const router = require("express").Router();

const bcryptjs = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;

const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");




// 1- Functionality to sign up
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});


router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password, country, experience } = req.body;

  if (!username || !password) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide username and password.",
    });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  bcryptjs.genSalt(saltRounds)
    .then(salt => {
      return bcryptjs.hash(password, salt);
    })
    .then(hash => {
      const userDetails = {
        username,
        password
      }
      return User.create(userDetails)
    })
    .then(userFromDB => {
      res.redirect("/") // TO BE CHANGED TO USER-PROFILE VIEW
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) { // check if it is a mongoose validation error
        res.status(400).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) { // check if mongoDB "unique" validation failed
        const text = "Email needs to be unique. There's already a user with this email address.";
        res.status(400).render('auth/signup', { errorMessage: text });
      } else {
        next(error);
      }
    });

  if (!country) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your country.",
    });
  }

  if (!experience) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your level of traveler's experience.",
    });
  }



  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          country,
          experience
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});



// Functionality to log in
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your username.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }

      bcryptjs.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});



// Functionality to logout
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});



module.exports = router;
