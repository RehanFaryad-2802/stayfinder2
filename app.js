// pakages
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Flash message
const flash = require("connect-flash");

// my data
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const User = require("./models/user.js");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const { isLogin } = require("./middleware.js");

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

const dbUrl = process.env.Mongodb_Link;
const store = MongoStore.create({
  mongoUrl: dbUrl,
  cripto: { secret: process.env.SECRET_SESSON_KEY },
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
  console.log("Session store error" -- +e);
})
app.use(
  require("express-session")({
    store: store,
    secret: process.env.SECRET_SESSON_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    if (req.user) {
      res.redirect("/listings");
    } else {
      res.render("home.ejs", { listings });
    }
  })
);
app.use("/listings", listingsRoute);
app.use("/listings/:id/review", ReviewRoute);
app.use("/", userRoute);

app.get("/admin", isLogin, async (req, res) => {
  if (req.user.username == "hamizuseAdmin") {
    let users = await User.find({}),
      listings = await Listing.find({})
        .populate({
          path: "reviews",
          populate: {
            path: "author",
          },
        })
        .populate("owner"),
      reviews = await Review.find({}).populate("author");
    res.render("./user/admin/admin.ejs", { users, listings, reviews });
  } else {
    res.redirect("/user/account");
  }
});

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
