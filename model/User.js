const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, require: true, unique: true}, 
    created: {type: Date, default: Date.now}
}); 

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);