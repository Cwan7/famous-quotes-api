const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Quote = require('./models/quotes.js')
const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

// .POST creating a new quote in the database/API
app.post('/quotes', async (req,res) => {
    const createdQuote = await Quote.create(req.body);
    res.json(createdQuote)
});

//.GET a route to find all quote
app.get('/quotes', async (req,res) => {
    const findQuote = await Quote.find();
    res.json(findQuote);
});

//.DELETE route to delete quote data from database.
app.delete('/quote/:quoteId', async (req,res) => {
    const deleteQuote = await Quote.findByIdAndDelete(req.params.quoteId);
    req.json(deleteQuote);
})

//.PUT route for updating quote in  the database
app.put('/quote/:quoteId', async (req,res) => {
    const updateQuote = await Quote.findByIdAndUpdate(
        req.params.quoteId, 
        req.body, 
        {new:true});
        req.json(updateQuote)
});
app.listen(3000, () => {
  console.log('The express app is ready!');
});