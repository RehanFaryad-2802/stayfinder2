const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

router
  .route("/signup")
  .get((req, res) => {
    res.render("../views/user/signup.ejs");
  })
  .post(
    wrapAsync(async (req, res) => {
      try {
        let { username, email, password, dp } = req.body;
        let NewUser = new User({ username, email, dp });
        let user = await User.register(NewUser, password);
        console.log(user);
        req.flash("success", "New User created!");
        res.redirect("/listings");
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
      }
    })
  );

  router.route("/login")
  .get((req, res) => {
    res.render("../views/user/login.ejs");
  })
  .post( passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),async (req, res, next) => {
    let { username, password } = req.body;
    req.flash("success", "Welcome Back!");
    res.redirect("/listings");
  })
module.exports = router;
