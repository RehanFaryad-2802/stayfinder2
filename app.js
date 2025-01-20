// express app
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const app = express();

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));

// mongoose connection
async function main() {
  await mongoose.connect(MONGO_URL);
}
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// home route

app.get("/",  async (req, res) => {
    let AllListing = await Listing.find({});
    console.log(AllListing);
    res.render("home.ejs", { AllListing });
});
app.get("/listings", (req, res) => {
  res.render("listings.ejs");
});
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});

// listing app

app.listen(8080, () => {
  console.log("app is listning");
});
