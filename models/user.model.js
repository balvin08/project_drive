const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unquie:true,
        minlength:[3,'username must be atleast 5 characters long']
    },

    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unquie:true,
        minlength:[13,'username must be atleast 13 characters long']
    },

    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[5,'password must be atleast 5 characters long']
    }

})

const User=mongoose.model('User',userSchema);

module.exports = User;
