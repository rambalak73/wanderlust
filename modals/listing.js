const mongoose = require('mongoose');
const Review = require('./review');
const connection = (url) => {
    return mongoose.connect(url);
}

const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required :true,
    },
    description : String,
    image: {
       url:String,
       filename:String,        
    },
    price : Number,
    location : String,
    country : String,
    review: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'review' 
    }],
    
    owner : {
        type : Schema.Types.ObjectId,
        ref:'User'
    }
})

listingSchema.post('findOneAndDelete', async(listing)=>{
    await Review.deleteMany({_id: {$in :listing.review}});
})

const Listing = new mongoose.model('Listing', listingSchema);
module.exports = {Listing, connection};