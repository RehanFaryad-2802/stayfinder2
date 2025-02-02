const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const { listingSchema } = require("../schema.js");
const { isLogin } = require("../middleware.js");
let validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const listings = await Listing.find({});
    res.render("listings.ejs", { listings });
  })
);

// Sending new listing page
router.get("/new", isLogin ,(req, res) => {
  res.render("new.ejs");
});

// Creating new listing
router.post(
  "/new",
  isLogin,
  validateListing,
  wrapAsync(async (req, res) => {
    let data = req.body;
    // await Listing.insertMany(data);
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
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    res.render("single_show.ejs", { listing });
  })
);

// Showing edit form
router.get(
  "/:id/edit",
  isLogin,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
  })
);

// Updating a listing
router.put(
  "/:id/edit",
  isLogin,
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
