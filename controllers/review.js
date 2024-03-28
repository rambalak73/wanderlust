const review  = require('../modals/review');
const {Listing} = require('../modals/listing');

module.exports.postReview = async(req,res) => {
    let id = req.params.id;
    let newReview = new review(req.body.review);
    const listing = await Listing.findById(id);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','review created');

    res.redirect(`/listing/${listing._id}`);
}

module.exports.destroyListing = async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await review.findByIdAndDelete(reviewId);

    req.flash('success','review deleted');
    res.redirect(`/listing/${id}`);
}