const uuid = require('uuid')
// const bcrypt = require('bcrypt')
const SHA256 = require("crypto-js/sha256")
const UserModel = require('../models/users')
const rp = require('request-promise');
const { render } = require('ejs');

const controllers = {

    showRegistrationForm: (req, res) => {

         // check if user if logged in
        // if logged in, redirect back to dashboard

        if(req.session && req.session.user) {
            res.redirect('/users/dashboard')
            return
        }
        res.render('users/register', {
            pageTitle: 'Register as a User'
        })
    },

    showLoginForm: (req, res) => {
        res.render('users/login', {
            pageTitle: 'User Login'
        })
    },

    register: (req, res) => {
        // validate the users input
        // not implemented yet, try on your own

        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // if found in DB, means email has already been take, redirect to registration page
                if (result) {
                    res.redirect('/users/register')
                    return
                }

                // no document found in DB, can proceed with registration

                // generate uuid as salt
                const salt = uuid.v4()

                // hash combination using bcrypt
                const combination = salt + req.body.password

                // hash the combination using SHA256
                const hash = SHA256(combination).toString()

                // create user in DB
                UserModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        req.session.user = createResult
                        res.redirect('/users/dashboard')
                    })
                    .catch(err => {
                        res.redirect('/users/register')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/users/register')
            })
    },

    login: (req, res) => {

        // gets user with the given email
        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // check if result is empty, if it is, no user, so login fail, redirect to login page
                if (!result) {
                    console.log('err: no result')
                    res.redirect('/users/login')
                    return
                }

                // combine DB user salt with given password, and apply hash algo
                const hash = SHA256(result.pwsalt + req.body.password).toString()

                // check if password is correct by comparing hashes
                if (hash !== result.hash) {
                    console.log('err: hash does not match')
                    res.redirect('/users/login')
                    return
                }

                // login successful

                console.log('login success')

                req.session.user = result
                
                res.redirect('/users/dashboard')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/users/login')
            })
    },
    logout: (req, res) => {

        req.session.destroy(function(err) {
            console.log(err)
          })
        res.redirect('../')
            
    },
    dashboard: (req, res) => {
        if(req.session.user){
            let defaultList = 'btc,eth,xrp,bnb,eos,ltc,usdt,xtz,bch,bsv,link,dot,ada,xmr,trx,xlm,neo'.split(',')
            let list = Array.from(new Set([...req.session.user.portfolio.map(i=>i.symbol),...defaultList]))
            console.log(list)
        
        const requestOptions = {
            method: 'GET',
            uri: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${list.join()}`,
            headers: {
              'X-CMC_PRO_API_KEY': 'f7eb16ab-8a3c-4086-8d33-1e76b4cfe6d3'
            },
            json: true,
            gzip: true
          };
          
            rp(requestOptions).then(response => {
                res.render('users/dashboard', {
                    user: req.session.user,
                    items: response.data,
                    loginStatus: Boolean(req.session.user)

                })
            }).catch((err) => {
                console.log('API call error:', err.message);
            });
            
          }else{
            res.redirect('login')
          }
           
    },

    newToken: (req, res) => {
        res.render("users/new",{
            inputs:req.query 
        })
    },

    createToken: (req, res) => {
        if(req.session.user){
            //update the user
            const newToken = {symbol:req.body.symbol, date:req.body.date, price:req.body.price, buy:req.body.buy, qty:req.body.qty}
            
            console.log(req.session.user)
            req.session.user.portfolio.push(newToken)
            //also need to update seesion
        UserModel.update(
            {
                email: req.session.user.email//'kevin@gmail.com'
            },
            {
                $push:{
                    portfolio: newToken
                }         
            })

            .then(data =>
                res.redirect('../dashboard')
            )
            .catch(err =>
                console.log(err)
            )

        }else{
            res.redirect('../login')
              
        }
    }
}


module.exports = controllers
