const express = require("express");
const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const { isLogin } = require("../middleware.js");

let validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.post(
  "/",
  isLogin,
  validateReviews,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let NewReview = new Review(req.body);
    listing.reviews.push(NewReview);
    NewReview.save();
    listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLogin,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);


module.exports = router