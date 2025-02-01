const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  dp: {
    type: String,
    set: (e) =>
      e == ""
        ? "https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/ee1a0e1d45629092d189851fc2385c97.jpeg"
        : e,
    default:
      "https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/ee1a0e1d45629092d189851fc2385c97.jpeg",
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
