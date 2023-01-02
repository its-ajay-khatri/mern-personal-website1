const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const Authenticate = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        //console.log("fetched token" + token);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        //console.log("verified token"+ verifyToken);
        const rootUser = await User.findOne({ tokens: token})

        if(!rootUser){
            throw new Error("User not found");
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    }
    catch(err){
        res.status(401).send("Unauthorised: No Token provided");
        console.log(err) 
    }
}

module.exports = Authenticate