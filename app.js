const dotenv = require('dotenv');
const express = require('express');
const app = express();
const path = require("path");
const User = require('./model/userSchema')
dotenv.config({ path: "./config.env" })
require('./db/conn');                      //importing database connection
const cookieParser = require("cookie-parser");
app.use(cookieParser());

dotenv.config();

app.use(express.json());                    //json to object

app.use(require('./router/auth'));            //linking the router files


const middleware = (req, res, next) => {
    console.log("Hello from the middleware");
    next();
}

app.get('/',middleware, (req, res) => {
    res.send('HomePage')
});

app.get('/contact', (req, res) => {
    res.send('ContactPage')
})


app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})

const port = 5000 || process.env.PORT;

app.listen(port, () => {
    console.log("listening @ "+ port)
})