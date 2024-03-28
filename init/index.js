const mongoose= require('mongoose');
const initData = require('./data');
const {Listing, connection} = require('../modals/listing');
const mongo_url = 'mongodb://127.0.0.1:27017/wonderlust';
connection(mongo_url);

const intiDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : '65d39bcc467665baa205599f'}))
    Listing.insertMany(initData.data);
    console.log("data insrted");
}

intiDB();

