const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String
    },
    like: {
        type: Array,
        default: []
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Post',postSchema)