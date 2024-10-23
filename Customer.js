const express = require('express');
const EEU = express.Router();
const {customerdb} = require('../userexampledb')

let inventory = [];
let reservations = [];
let users = [];

user.post('/signup', function (req, res){
    res.send('Created a new account')
});
user.get('/login', function (req, res){
    res.send('Logged in')
});
user.get('/dashboard', function (req, res){
    res.send('View dashboard')

});
user.get('/dashboard/products', function (req, res){
    res.send('View Products')
});
user.get('/dashboard/products/reserve', function (req, res){
    res.send('Reserve products')
});
user.get('/dashboard/products/cancelreserve', function (req, res){
    res.send('cancel reserved products')
});
user.get('/dashboard/products/reserve/paymentslip', function (req, res){
    res.send('View payment slip')
});

module.exports = Customer;
