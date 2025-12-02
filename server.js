const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const User = require("/project/workspace/model/User.js");

/*---------------- SESSION SET UP ----------------- */
const session = require("express-session");
app.use(
  session({
    secret: "1233211",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, //1 hour
  })
);

/* --------------- MIDDLEWARE SET UP ----------------- */
app.use(express.json());
const bodyParser = require("body-parser");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* -------------- register/login ------------------- */
app.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const user = new User({ email, name });
    await User.register(user, password);
    res.json({ message: "User created!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in!", user: req.user });
});

app.get("/auth-status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

/*----------------- start server -----------------*/
app.listen(port, () => {
  console.log(`server running on localhost:${port}`);
});

// test

mongoose
  .connect(
    `mongodb+srv://lincolncraddock:m7auLAtPf75BcukP@cluster0.zdso4zo.mongodb.net/?appName=Cluster0`
  )
  .then(() => console.log("connected"))
  .catch((e) => console.log(`whoops, didn't connect: ${e.message}`));
