// const express = require("express");
// const path = require("path");
// const app = express();
// const port = 3000;
// const mongoose = require("mongoose");
// const User = require("/project/workspace/model/User.js");
// const Order = require("/project/workspace/model/Order.js");

// /*---------------- SESSION SET UP ----------------- */
// const session = require("express-session");
// app.use(
//   session({
//     secret: "1233211",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 60 * 1000 }, //1 hour
//   })
// );

// /* --------------- MIDDLEWARE SET UP ----------------- */
// app.use(express.json());
// const bodyParser = require("body-parser");
// const passport = require("passport");
// const connectEnsureLogin = require("connect-ensure-login");
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// /*---checks username and password automatically---*/
// passport.use(User.createStrategy());

// // passport configurations
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// //serves all files inside of this current folder
// app.use(express.static(path.join(__dirname)));

// /* ----------------- get routes ---------------------*/

// //set index.html as the root route
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// app.get("/auth-status", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ loggedIn: true, user: req.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });
// /* -------------- POST routes ------------------- */
// app.post("/register", async (req, res) => {
//   try {
//     const { email, name, password } = req.body;
//     const user = new User({ email, name });
//     await User.register(user, password, function (err) {});
//     res.json({ message: "User created!" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// app.post(
//   "/login",
//   passport.authenticate("local", { failureRedirect: "/" }),
//   (req, res) => {
//     res.json({ message: "Logged in!", user: req.user });
//   }
// );

// /*----------------- start server -----------------*/
// mongoose
//   .connect(
//     "mongodb+srv://admin:test1@amazon-db.sccapev.mongodb.net/users?retryWrites=true&w=majority&appName=amazon-db"
//   )
//   .then(() => {
//     console.log("connected");
//   })
//   .catch((e) => console.log(`whoops, didn't connect: ${e.message}`));

// app.listen(port, () => {
//   console.log(`server running on localhost:${port}`);
// });

// /*  ------------------ error handler --------------------- */
// app.use((err, req, res, next) => {
//   res.status(401).json({ message: err.message || "Unauthorized" });
// });
// /*
// // test user registration
// User.register( {"lincoln67", "lincoln67@g.c"}, "pw");
// */

/* ---------------------------------------------------------------------------------------------------------------------------------- */
const express = require("express"); // Import the Express framework – used to build the web server
const bodyParser = require("body-parser"); // Middleware that helps parse data sent from forms (POST requests)
const session = require("express-session"); // Middleware for creating and managing user sessions (stores who’s logged in)
const passport = require("passport"); // Authentication library – handles login and verifying credentials
const connectEnsureLogin = require("connect-ensure-login"); // Middleware to protect pages so only logged-in users can access them

const { User, Order } = require(__dirname + "/Model.js");

const app = express(); // Create an instance of an Express application

console.log("My name is server.js!");

// vvv our code vvv
app.use(express.json());

// ======================
// Configure Session Middleware
// ======================
// This section tells Express how to handle sessions (temporary storage between requests).
// - 'secret' is a random string used to sign the session ID cookie (like a password for your sessions)
// - 'resave: false' means don’t save session data if nothing has changed
// - 'saveUninitialized: true' means save new sessions that haven’t been modified yet
// - 'cookie.maxAge' sets how long the session lasts before it expires (here: 1 hour)
app.use(
  session({
    secret: "r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

// ======================
// Configure Other Middleware
// ======================
// bodyParser lets you read submitted form data via 'req.body'
// passport.initialize() starts Passport authentication
// passport.session() connects Passport with the session system, so login status is remembered
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// ======================
// Configure Passport Strategy
// ======================
// This tells Passport to use the strategy created by the User model (passport-local-mongoose provides this automatically)
// It will check usernames and passwords during login.
passport.use(User.createStrategy());

// These methods define how Passport stores and retrieves user info in sessions.
// serializeUser → what user data to save in session
// deserializeUser → how to turn that saved data back into a full user object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======================
// Serve Static Files
// ======================
// express.static allows Express to serve files like images, CSS, and HTML from the given folder.
// '__dirname' is the folder where this script lives.
app.use(express.static(__dirname));

// ======================
// Routes (URLs)
// ======================
// A route defines what happens when someone visits a certain URL.

// -------- Home Page --------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // Sends the index.html page as the homepage
});

// vvv our code, not X's vvv
app.get("/auth-status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// vvv X's code we don't need vvv
// // -------- Login Page --------
// app.get('/login', (req, res) => {
//   res.sendFile(__dirname + '/views/html/login.html'); // Same as above
// });

// -------- Dashboard Page --------
// The connectEnsureLogin middleware checks if user is logged in.
// If not logged in, it automatically redirects to the login page.
app.get("/dashboard", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + "/dashboard.html");
});

// // -------- Secret Page (Protected) --------
// // Only logged-in users can access this page.
// // Sends a private HTML file.
// app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
//   res.sendFile(__dirname + '/views/html/private.html');
// });

// // -------- Index Page (Protected) --------
// // This is the main page after a successful login.
// app.get('/index', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
//     res.sendFile(__dirname + '/views/html/index.html');
//   });

// -------- Log Out --------
// req.logout() removes the user from the session (logs them out).
// After logout, redirect back to index.html page.
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.log(`failed to log a user out because ${err.message}`);
      return next(err);
    }
    console.log("logged a user out");
    res.redirect("/");
  });
});

// // -------- Registration Page --------
// // Shows the signup form.
// app.get('/register', (req, res) => {
//   res.sendFile(__dirname + '/views/html/register.html');
// });

// // -------- CSS Routes --------
// // These directly send CSS files when accessed.
// // Normally you’d just use express.static(), but here they’re manually routed.
// app.get('/css', (req, res) => {
//     res.sendFile(__dirname + '/views/css/styles.css');
//   });

// app.get('/css-store', (req, res) => {
//   res.sendFile(__dirname + '/views/css/store.css');
// });

// // -------- Store Main Page --------
// app.get('/main', (req, res) => {
//   res.sendFile(__dirname + '/views/html/main.html');
// });

// // -------- Store JavaScript File --------
// app.get('/storejs', (req, res) => {
//   res.sendFile(__dirname + '/store.js');
// });

// // -------- Product JSON File --------
// app.get('/products', (req, res) => {
//   res.sendFile(__dirname + '/products.json');
// });

// ======================
// POST Routes
// ======================

// -------- Register (POST) --------
// This handles form submission from the registration page.
// User.register() is provided by passport-local-mongoose and automatically hashes the password.
app.post("/register", function (req, res, next) {
  User.register(
    { name: req.body.name, email: req.body.email },
    req.body.password,
    function (err) {
      if (err) {
        console.log("Error in user register!", err);
        res.json({ registered: false });
        return next(err);
      }

      console.log("User registered!");
      res.json({ registered: true, user: req.user });
    }
  );
});

app.post("order", function (req, res, next) {
  Order.register(
    {
      email: req.body.email,
      products: req.body.products,
      quantities: req.body.stock,
      prices: req.body.prices, // Ideally retrieved server side and not provided by client.
    },
    function (err) {
      if (err) {
        console.log("error while order!", err);
        return next(err);
      }

      console.log("order placed!");
    }
  );
});

// -------- Login (POST) --------
// passport.authenticate('local') checks username and password.
app.post("/login", passport.authenticate("local"), function (req, res) {
  console.log(`Logged in ${req.user.name}`);
  console.log("i should be inside of this block of code");
  res.json({ loggedIn: true, user: req.user });
});

// -------- Get User Info --------
// This is a route to let the frontend know who is currently logged in.
// It returns the user’s data as JSON (e.g., {user: {name, email, username, ...}}).
app.get("/user", connectEnsureLogin.ensureLoggedIn(), (req, res) =>
  res.send({ user: req.user })
);

// ======================
// Start Server
// ======================
// This sets the port to 3000 and starts listening for requests.
// When it’s ready, it prints a message in the console.
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));
