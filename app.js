// pakages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const app = express();

// Flash message
const session = require("express-session");
const flash = require("connect-flash");
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());
// my data
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");

// routes
const userRoute = require("./Router/userRouter.js");
const listingsRoute = require("./Router/listingRouter.js");
const ReviewRoute = require("./Router/reviews.js");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));

// passport setup
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());



app.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});

    res.render("home.ejs", { listings });
  })
);
app.use("/", userRoute);
app.use("/listings", listingsRoute);
app.use("/listings/:id/review", ReviewRoute);

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
