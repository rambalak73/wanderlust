const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/error.js');
const flash = require('connect-flash');
const { listingSchema } = require('../schema.js');
const { isLoggedin, isOwner } = require('../middlewares/middleware.js');
const ListingControllers = require('../controllers/listing.js');
const multer = require('multer');
const {storage} = require('../cloudinaryConfig.js');
const upload = multer({storage});


const validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(500, errMsg);
    } else {
        next();
    }
}

router.route('/').get(wrapAsync(ListingControllers.index))
.post( isLoggedin, upload.single('listing[image]'),validateSchema, wrapAsync(ListingControllers.createListing));

// create listings
router.get('/new', isLoggedin, wrapAsync(ListingControllers.renderForm));

// read operation
router.route('/:id').get(wrapAsync(ListingControllers.showListing))
.put(isLoggedin, isOwner, upload.single('listing[image]'), validateSchema, wrapAsync(ListingControllers.updateListing))  //upate
.delete(isLoggedin, isOwner, wrapAsync(ListingControllers.destroyListing));  //delete a listing

router.get('/:id/edit', isLoggedin, isOwner, wrapAsync(ListingControllers.renderEditForm)); // edit listings

module.exports = router;