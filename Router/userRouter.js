const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveReturnTo, isLogin } = require("../middleware.js");
const Listing = require("../models/listing.js");

router.route("/logout").get((req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "successfully logged out!");
      res.redirect("/listings");
    }
  });
});

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
        let registeredUser = await User.register(NewUser, password);
        req.login(registeredUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "Welcome to Stay Finder!");
          res.redirect("/listings");
        });
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
      }
    })
  );

router
  .route("/login")
  .get((req, res) => {
    res.render("../views/user/login.ejs");
  })
  .post(
    saveReturnTo,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res, next) => {
      let { username, password } = req.body;
      req.flash(
        "success",
        `Welcome Back "${username.charAt(0).toUpperCase() + username.slice(1)}"`
      );
      res.redirect(res.locals.returnTo || "/listings");
    }
  );

router.route("/user/:userName").get(isLogin, async (req, res) => {
  let { userName } = req.params;
  if (userName !== req.user.username) {
    req.flash("error", "You don't have permission to view this page!");
    return res.redirect("/listings");
  }
  let UserListings = await Listing.find({ owner: req.user._id });
  res.render("../views/user/profile.ejs", { UserListings });
});

router.route("/user/:user/profile").get(async (req, res) => {
  let { user } = req.params;
  let UserDetails = await User.find({ username: user });
  let UserListings = await Listing.find({ owner: UserDetails[0]._id });
  res.render("../views/user/channel.ejs", { UserListings, UserDetails });
});
module.exports = router;
