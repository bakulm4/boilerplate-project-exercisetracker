const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    userId:{
        type:mongoose.ObjectId,
        required:[true,'Please provide a valid user ID']
    },
    description:{
        type:String,
        required:[true,'Please provide a description'],
        maxLength:100
    },
    duration:{
        type:Number,
        required:[true,'Please provide exercise duration length'],
        min:1
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Exercise',exerciseSchema);