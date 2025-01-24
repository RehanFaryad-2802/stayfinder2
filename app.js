// pakages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const app = express();

// my data
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// mongoose connection
main()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

// home route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("home.ejs", { listings });
  })
);

// Showing all listings
app.get(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const listings = await Listing.find({});
    res.render("listings.ejs", { listings });
  })
);

// Sending new listing page
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});

// Creating new listing
app.post(
  "/listings/new",
  wrapAsync(async (req, res) => {
    let data = req.body;
    console.log(req.body);

    await Listing.insertMany(data);
    res.redirect("/listings");
  })
);

// Deleting a listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// Showing a single listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("single_show.ejs", { listing });
  })
);

// Showing edit form
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
  })
);

// Updating a listing
app.put(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id, data);
    res.redirect(`/listings/${id}`);
  })
);

app.all("*", async (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error handling

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

app.listen(8080, () => {
  console.log("app is listning");
});
