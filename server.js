const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('/project/workspace/model/User.js');
const MONGO_URL = "mongodb+srv://admin:testing1@amazon-db.sccapev.mongodb.net/users?appName=amazon-db";

/*----------------------- mongodb connection --------------------------*/ 
mongoose.connect(MONGO_URL )
.then(()=>{
    console.log("MongoDB connection successful!")
})
.catch(err => console.log("mongoDB connection failed: " + err));



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

/* ----------------- server configs ---------------------*/

//serves all files inside of this current folder
app.use(express.static(path.join(__dirname)));

//set index.html as the root route 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


/* -------------- registration ------------------- */
app.post("/register", async (req, res) =>{
    try{
        const { email, username, password } = req.body;
        const user = new User({email,password});
        await User.register(user, password);
        res.json({message: "User created!"});
    }catch(err){
        res.status(400).json({message: err.message});
    }
})


/*----------------- start server -----------------*/
app.listen(port, ()=>{
    console.log(`server running on localhost:${port}`);
});


