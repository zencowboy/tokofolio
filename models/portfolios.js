const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
    },
    portfolio_id: {
        type: String,
    },
    cost_per_coin: {
        type: Number,
    },
    currency: {
        type: String,
    },
   qty: {
       type: Number,
       min: 0,
       required: true
   }
})

const portfolioModel = mongoose.model('portfolio', portfolioSchema)
module.exports = portfolioModel

