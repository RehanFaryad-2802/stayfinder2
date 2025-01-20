const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        filename: String,
        url: String
    },
    price: Number,
    location: String,
    country: String
})

let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;