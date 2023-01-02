const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({           //creating schema(structure of document/data)
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: 
        {

                type: String,
                
            
        }
    
})

//token generation
// userSchema.methods.generateAuthToken = async () => {
//     try{
//         let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);                 //this._id means line 61 in auth.js
//         this.tokens = this.tokens.concat({ token: token });
//         await this.save();
//         return token;
//     }
//     catch(err){
//         console.log(err);
//     }
// }


const User = mongoose.model('user', userSchema);          //will create a collection/table named as user in the existing DB

module.exports = User;