const express=require('express');
const bcrypt=require('bcryptjs');
const customer=express.Router();
customer.use(express.json());

customer.post('/login',function(req,res){
    res.send('EEU login for EEU');
});

customer.post('/signup', function(req, res){
    res.send('EEU signup for EEU');
});

customer.get('/dashboard', function(req, res){
    res.send('EEU dashboard');
});

module.exports = customer;