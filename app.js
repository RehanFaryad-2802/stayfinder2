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

app.get("/", async (req, res) => {
  const listings = await Listing.find({});
  console.log(listings[0].image.url);
  res.render("home.ejs", { listings });
});
app.get("/listings", async (req, res) => {
  const listings = await Listing.find({});

  res.render("listings.ejs", { listings });
});
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("single_show.ejs", { listing });
});

// listing app

app.listen(8080, () => {
  console.log("app is listning");
});
