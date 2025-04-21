const mongoose = require('mongoose');    //importing mongoose

const connection=mongoose.connect('mongodb://0.0.0.0/PROJECT_DRIVE')  //connecting to the db
console.log('connected to db');


module.exports=connection;  //exporting the connection to the db