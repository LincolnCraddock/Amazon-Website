const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('/model/User.js');


/* --------------- MIDDLEWARE SET UP ----------------- */
app.use(express.json());
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');



/*------------------ connecting MongoDB -------------- */
mongoose.connect(
    'mongodb+srv://admin:testing1@cluster0.vwlqvme.mongodb.net/amazon-db?appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>
        console.log("MongoDB connected!"))
    .catch((err)=> 
        console.log("MongoDB not connected " + err))




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


