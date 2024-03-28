const { Listing } = require('../modals/listing');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.createListing = async (req, res) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    let url = req.file.path;
    let filename=req.file.filename;
    listing.image = {url, filename};

    await listing.save();
    req.flash('success', 'new listing added successfully');
    res.redirect("/listing");
}

module.exports.renderForm = (req, res, next) => {
    res.render('listings/form.ejs');
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const showId = await Listing.findById(id).populate({ path: 'review', populate: { path: 'author' } }).populate('owner');
    if (!showId) {
        req.flash('error', 'listing you  requested does not found');
        res.redirect('/listing');
    }
    res.render("listings/show.ejs", { showId });
}

module.exports.updateListing = async (req, res, next) => {
    let id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != undefined){
        let url = req.file.path;
        let filename=req.file.filename;
        listing.image = {url, filename};
        await  listing.save();
    }
    req.flash('success', 'listing updated');
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'listing deleted');
    res.redirect('/listing')
}

module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'listing you  requested does not found');
        res.redirect('/listing');
    }
    let originalImage = listing.image.url;
    originalImage.replace('/upload', '/upload/w_250');
    res.render('listings/edit.ejs', { listing, originalImage });
}