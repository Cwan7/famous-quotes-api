const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
    author: {
       type: String, 
       required: true
    },
    category: {
        type: String,
        required: true
    },
    quote:  {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: 'Unknown'
    },
    image: String,
    user: String // will reference to another model.
});
const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
