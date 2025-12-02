const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created: { type: Date, default: Date.now },
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "name",
  usernameQueryFields: ["name", "email"],
});

module.exports = mongoose.model("User", UserSchema);
