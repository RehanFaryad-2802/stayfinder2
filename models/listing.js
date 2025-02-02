const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    filename: String,
    url: {
      type: String,
      set: (e) =>
        e == ""
          ? "https://prepbytes-misc-images.s3.ap-south-1.amazonaws.com/assets/1674634933779-Method%20Overriding%20in%20Java.jpg"
          : e,
      default:
        "https://prepbytes-misc-images.s3.ap-south-1.amazonaws.com/assets/1674634933779-Method%20Overriding%20in%20Java.jpg",
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner : {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}})
  }
})

module.exports = mongoose.model("Listing", listingSchema);
