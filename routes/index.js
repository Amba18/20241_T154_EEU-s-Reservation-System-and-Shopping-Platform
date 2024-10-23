const express = require ('express');
const app = express();

const  students  = require('./exampleDB'); 


const customerRoute = require('./routes/customer')
const EEURoute = require('./routes/EEU')


app.use('/users', customerRoute);
app.use('/EEU', EEURoute);


app.listen(3000, () => {
    console.log("Server is running on port 3000")
});