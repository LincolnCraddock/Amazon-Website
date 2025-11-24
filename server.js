const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('/project/workspace/model/User.js');


/*---------------- SESSION SET UP ----------------- */
const session = require('express-session');
app.use(session({
    secret: "1233211",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }  //1 hour
}));


/* --------------- MIDDLEWARE SET UP ----------------- */
app.use(express.json());
const bodyParser = require('body-parser');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

/*---checks username and password automatically---*/
passport.use(User.createStrategy());

// passport configurations
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//serves all files inside of the current folder
app.use(express.static(path.join(__dirname)));

//set index.html as the root route 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});



/*----------------- start server -----------------*/
app.listen(port, ()=>{
    console.log("server running on localhost:{port}");
});


