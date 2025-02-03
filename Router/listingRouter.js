const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogin, isOwner, validateListing } = require("../middleware.js");

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const listings = await Listing.find({});
    res.render("listings.ejs", { listings });
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
  validateListing,
  wrapAsync(async (req, res) => {
    let data = req.body;
    const newListing = await Listing.create(data);
    newListing.owner = req.user._id;
    newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
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
    res.redirect("/listings");
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
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id, data);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
