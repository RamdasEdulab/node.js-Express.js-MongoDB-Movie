const mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    image:{type:String,
        required: 'This field is required.'
    },
    summary: {
        type: String,
        required: 'This field is required.'
    }, 
});

mongoose.model('Movie', movieSchema);