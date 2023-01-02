const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');                           //used for password encryption while storing into db
var salt = bcrypt.genSaltSync(10);                          //storing 10 in salt means encrypt password upto 10 characters
const jwt = require('jsonwebtoken');                            //importing token library
//const authenticate = require('../middleware/authenticate');
const cookieParser = require('cookie-parser')

router.use(cookieParser());
require('../db/conn');

const User = require('../model/userSchema')

var checkLoginUser = (req, res, next) => {               //this function will help to match and veryfy token, if the token is verified, then an only then user will be redirected to dashboard
    try {
      var userToken = localStorage.getItem('userToken');
      var decoded = jwt.verify(userToken, 'loginToken');
    } catch(err) {
      res.redirect('/')
    }
    next();
  }
  
  
  if (typeof localStorage === "undefined" || localStorage === null) {       //creating localstorage
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

router.get('/about', (req, res) => {
    res.send('About')
});

router.post('/register', async (req, res) => {                //register/signup

    var { name, email, phone, work, password, cpassword } = req.body;


    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({ error: "Please enter all data properly"});
    }

    try{
        const userexist = await User.findOne({ email: email })            //email already exists validation
        
        if(userexist){
            return res.status(422).json({ error: "Email already exists"});
        }

        if(password != cpassword){
            return res.status(422).json({ error: "Password and Cpassword Didnt match"});
        }

        password = bcrypt.hashSync(req.body.password, salt);                 //user entered password is encrypted upto 10 characters 
        cpassword = bcrypt.hashSync(req.body.cpassword, salt);                 //user entered password is encrypted upto 10 characters 

        const user = new User({name: name, email: email, phone: phone, work: work, password: password, cpassword: cpassword })       //storing data into DB

        const userRegister = await user.save();                               //storing data into db

        res.status(201).json({ message : "User registered successfully"});   
    }

    catch(err) {
        console.log(err.message);
    }

    //res.send("Ok Register Page");
    //console.log(req.body);
    //res.json({message : req.body });            //use to display output at postman
});


router.post('/signin', async (req, res) => {               //login/signin

    try {
        var { email, password } = req.body;

        if(!email || !password){                               //this._id
            return res.status(422).json({error : "please enter data"})
        }

        let userexists = await User.findOne({ email: email})            //email already exists validation
        var getUserId = userexists._id;
        if(userexists){
            const passmatch = await bcrypt.compare(password, userexists.password)                //comparing user entered password with encrypted password stored in db
            
            if(!passmatch){
                res.status(400).json({message : "user Does Not Exist"})
            }
            var token = jwt.sign({ userId: getUserId }, 'loginToken', {expiresIn: 3600});      //generating/creating a token with name "logintoken"
            localStorage.setItem('userToken', token);
            //localStorage.setItem('loginUser', email);                    //set token
            //console.log(token)

            var update_passCat = User.findByIdAndUpdate(getUserId, {tokens: token})

            update_passCat.exec((err, doc) => {                            //fetching and executing all the data present in password_category table/collection
              if(err){ console.log(err.message); }
            });
        
            return res.json({message : "user Logged In", status: "ok", user: token });

        }
        res.status(400).json({message : "user Does Not Exist"})
    }
    catch(err){
        console.log(err.message);
    }
})

// router.get('/about', async (req, res) => {
//     try {
//         var userToken = localStorage.getItem('userToken');
//         var decoded = jwt.verify(userToken, 'loginToken');
//       } catch(err) {
//         res.redirect('/')
//       }
// })

router.get('/logout', function(req, res, next) {
    localStorage.removeItem('userToken');
    //localStorage.removeItem('loginuser');
    console.log("ho1")
    res.redirect('http://localhost:3000/');
  });

module.exports = router;