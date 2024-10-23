const express = require ('express');
const app = express();

const  userdb  = require('./exampleDB'); 


const customerRoute = require('./routes/Customer.js')
const EEURoute = require('./routes/EEU.js')


app.use('/users', customerRoute);
app.use('/EEU', EEURoute);


app.listen(3000, () => {
    console.log("Server is running on port 3000")
});