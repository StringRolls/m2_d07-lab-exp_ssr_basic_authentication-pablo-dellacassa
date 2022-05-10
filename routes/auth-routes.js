const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT || 10;

const User = require("../models/User.model");

const isNotLoggedIn = require("../middlewares/isNotLoggedIn");

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isNotLoggedIn, (req, res) => {
  //Get values from form
  const { username, email, password } = req.body;

  //Validate input
  if (!username || !password || !email) {
    res.render("auth/signup", { errorMessage: "Something went wrong" });
  }

  //Check if user already exists
  User.findOne({ username: username })
    .then((user) => {
      //If user exists, send error
      if (user) {
        res.render("auth/signup", { errorMessage: "This user already exists" });
        return;
      } else {
        //Hash the password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        //If user does not exist, create it
        User.create({ username, email, password: hash })
          .then((newUser) => {
            console.log(newUser);
            //Once created, redirect
            res.redirect("/login");
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isNotLoggedIn, (req, res) => {
  //Get values from form
  const { username, email, password } = req.body;

  //Validate input
  if (!username || !password || !email) {
    res.render("auth/signup", { errorMessage: "Something went wrong" });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "Input invalid" });
      } else {
        const encryptedPassword = user.password;
        const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);

        if (passwordCorrect) {
          req.session.currentUser = user;
          res.redirect("/private/profile");
        } else {
          res.render("auth/login", { errorMessage: "Input invalid" });
        }
      }
    })
    .catch((err) => console.log(err));
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { message: "Something went wrong!" });
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
