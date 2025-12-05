// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   created: { type: Date, default: Date.now },
// });

// UserSchema.plugin(passportLocalMongoose, {
//   usernameField: "name",
//   usernameQueryFields: ["name", "email"],
// });

// module.exports = mongoose.model("User", UserSchema);

// =======================
// Import Dependencies
// =======================

// 'mongoose' is a popular Node.js library that lets us connect to a MongoDB database
// and define the structure (schema) of the documents we will store there.
const mongoose = require("mongoose");

// 'passport-local-mongoose' is a plugin that makes user authentication much easier.
// It automatically adds fields like 'hash' and 'salt' to store passwords securely,
// and it provides helper functions for registering and logging in users.
const passportLocalMongoose = require("passport-local-mongoose");

// =======================
// Define Schema
// =======================

// A Schema is like a "blueprint" for what data a collection should hold.
// Think of it as defining the columns and data types if this were a SQL table.
//
// In this case, we’re defining a 'User' schema with three fields:
// - name: the user's full name
// - email: the user's email address
// - username: the name they will use to log in
//
// Note: We don’t define a password field here — the 'passport-local-mongoose'
// plugin will handle that automatically by adding hashed password fields.
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: String,
  created: { type: Date, default: Date.now },
});

// =======================
// Add Authentication Plugin
// =======================

// This line is CRUCIAL. By calling 'User.plugin(passportLocalMongoose)',
// we are attaching all the helpful authentication methods to our User schema.
//
// What this plugin does behind the scenes:
// - Adds two fields to the schema: 'hash' and 'salt' to securely store passwords
// - Adds methods like:
//     - 'register()' for creating users with hashed passwords
//     - 'authenticate()' for checking login credentials
//     - 'serializeUser()' and 'deserializeUser()' for session handling
//
// So you don’t need to manually deal with password hashing — it’s all done for you!
User.plugin(passportLocalMongoose, {
  usernameField: "name",
  usernameQueryFields: ["name", "email"],
});

// =======================
// Export Model
// =======================

// Here we create and export the actual Mongoose model based on our schema.
// 'mongoose.model()' takes two arguments:
//   1. The name of the collection in the database ('userinfos')
//   2. The schema that defines how the documents look ('User')
//
// This lets other files in your project do:
//     const User = require('./path/to/this/file');
//     User.find(...), User.register(...), etc.
module.exports = mongoose.model("Users", User);

// =======================
// OPTIONAL: Insert Test Data
// =======================
//
// The following lines are commented out, but they show how you can
// insert a sample user for testing purposes.
//
// Step-by-step:
//
// 1. We first create a model object:
//        var UserDetail = mongoose.model('userinfos', User);
//
// 2. Then we register (create) a new user:
//        UserDetail.register(
//          { name: 'LALAL', email: 'lala@lala.com', username: 'candy' },
//          'cane'
//        );
//
//    The second argument ('cane') is the password — it will NOT be stored directly.
//    Instead, it will be automatically hashed and salted by the plugin.
//
//    This means even if someone looks inside your database,
//    they cannot see the real passwords.
//
