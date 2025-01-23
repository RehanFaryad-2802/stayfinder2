// express app
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
// method override
const methodOverride = require("method-override");
const app = express();

app.use(methodOverride('_method'))
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
  res.render("home.ejs", { listings });
});
app.get("/listings", async (req, res) => {
  const listings = await Listing.find({});

  res.render("listings.ejs", { listings });
});
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});
app.post("/listings/new", async(req, res) => {
  let data = req.body;
  await Listing.insertMany(data);
  res.redirect("/listings");
});
app.delete("/listings/:id", async(req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("single_show.ejs", { listing });
});
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
});
app.put("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  let done = await Listing.findByIdAndUpdate(id, data);
  res.redirect(`/listings/${id}`);
});

// listing app

app.listen(8080, () => {
  console.log("app is listning");
});
