const coinsModel = require('./../models/portfolios');
const rp = require('request-promise');

const controllers = {



    listCoins: (req, res) => {
      const requestOptions = {
        method: 'GET',
        uri: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=btc,eth,xrp,bnb,eos,ltc,usdt,xtz,bch,bsv,link,dot,ada,xmr,trx,xlm,neo`,
        headers: {
          'X-CMC_PRO_API_KEY': 'f7eb16ab-8a3c-4086-8d33-1e76b4cfe6d3'
        },
        json: true,
        gzip: true
      };
      
      rp(requestOptions).then(response => {
        res.render('homepage', {
          pageTitle: "Start your Tokofolio today!",
          tokenIndex: coinsModel,
          items: response.data
      })
      }).catch((err) => {
        console.log('API call error:', err.message);
      });
        

    },

    getLatest: (req, res) => {
      let data = [];
      res.json(data);
    },
    showCoins: (req, res) => {
        let search = req.query.search
        const requestOptions = {
            method: 'GET',
            uri: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${search}`,
            headers: {
              'X-CMC_PRO_API_KEY': 'f7eb16ab-8a3c-4086-8d33-1e76b4cfe6d3'
            },
            json: true,
            gzip: true
          };
          
          rp(requestOptions).then(response => {
            res.render('portfolio', {
                pageTitle: "Show Coin",
                items: response.data
            })
          }).catch((err) => {
            console.log('API call error:', err.message);
          });

    }
}
    
    
function checkParamId(givenID, collection) {
    if (givenID < 0 || givenID > collection.length - 1) {
        return false
    }

    return true
}

module.exports = controllers