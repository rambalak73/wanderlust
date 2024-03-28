const {Listing} = require('../modals/listing');
const Review = require('../modals/review');

module.exports.isLoggedin = (req, res, next) => {
   
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in');
        res.redirect('/login');
    }
    else {
        next();
    }
}

module.exports.saveUrl = (req, res, next) => {
    if (req.session.redirectUrl)
        res.locals.redirectUrl = req.session.redirectUrl;
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", 'You Are not owner of Listing');
        return res.redirect(`/listing/${id}`);
    }
    next();
}


module.exports.isreviewAuthor = async(req, res, next) => {
    let {id,reviewId} = req.params;
    let reviews = await Review.findById(reviewId);
    if(!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error", 'You Are not owner of Review');
        return res.redirect(`/listing/${id}`);
    }
    next();
}