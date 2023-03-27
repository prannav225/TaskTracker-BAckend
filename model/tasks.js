const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    tname:{
        type:String,
        requried:true
    },
    sdate:{
        type:String,
        requried:true
    },
    edate:{
        type:String,
        requried:true
    },
    priority:{
        type:String,
        requried:true
    },
})

module.exports = mongoose.model('TaskTracker', taskSchema);