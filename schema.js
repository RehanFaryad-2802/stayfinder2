const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title : Joi.string().required().min(10),
    description: Joi.string().required(),
    price: Joi.number().required().min(1),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.allow("", null)
})