const express = require("express");
const router = express.Router();
const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogin, isOwner, validateListing } = require("../middleware.js");

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const listings = await Listing.find({});
    if(req.user){
      res.render("listings.ejs", { listings });
    }else{
      req.flash("error", "You must be logged in!");
      res.render("../views/user/login.ejs");
    }
  })
);

// Sending new listing page
router.get("/new", isLogin, (req, res) => {
  res.render("new.ejs");
});

// Creating new listing
router.post(
  "/new",
  isLogin,
  upload.single("image[url]"),
  validateListing,
  wrapAsync(async (req, res) => {
    let data = req.body;
    let filename = req.file.filename;
    let url = req.file.path;
    const newListing = await Listing.create(data);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/user/account");
  })
);

// Deleting a listing
router.delete(
  "/:id",
  isLogin,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Listing deleted!");
    res.redirect("/user/account");
  })
);

// Showing a single listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    listing.views++;
    listing.save();
    res.render("single_show.ejs", { listing });
  })
);

// Showing edit form
router.get(
  "/:id/edit",
  isLogin,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
  })
);

router.put(
  "/:id/edit",
  isLogin,
  isOwner,
  upload.single("image[url]"),
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body });
    if (typeof req.file !== "undefined") {
      // res.send(`${req.file} , ${listing}`);
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/user/account`);
  })
);

module.exports = router;
