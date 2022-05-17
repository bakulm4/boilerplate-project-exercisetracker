const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please provide a login user name']
    }
});

module.exports = mongoose.model('User',userSchema);