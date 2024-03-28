const express = require('express');
const route = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/error.js');
const { reviewSchema } = require('../schema.js');
const {isLoggedin, isreviewAuthor} = require('../middlewares/middleware.js');
const ReviewController = require('../controllers/review.js');

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(500, errMsg);
    }else{
        next();
    }
}

// post a review
route.post('/',isLoggedin, validateReview, wrapAsync(ReviewController.postReview));

// Delete a Review
route.delete('/:reviewId',isLoggedin,isreviewAuthor, wrapAsync(ReviewController.destroyListing));

module.exports=route;