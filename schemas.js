const Joi = require('joi');

module.exports.askSchema = Joi.object({
    ask: Joi.object({
        topic: Joi.string().required(),
        tags: Joi.string().required(),
        content: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})