const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// =======================
// Connect to MongoDB
// =======================

// We use 'mongoose.connect()' to open a connection to our MongoDB database.
// Here we’re connecting to a MongoDB Atlas cluster using a connection string.
//   ⚠️ Normally, we should NOT hardcode the username and password in code —
//   they should go into environment variables for security reasons.
//   But for testing or class demos, this is fine.
mongoose
  .connect(
    "mongodb+srv://admin:testPass@cluster0.t3e421b.mongodb.net/slop-shop-db?retryWrites=true&w=majority&tls=true&appName=Cluster0",
    {
      //useNewUrlParser: true,    // This option ensures compatibility with modern MongoDB drivers.
      //useUnifiedTopology: true  // This option uses the new server discovery and monitoring engine.
    }
  )
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(() => console.log("Unable to connect to MongoDB"));

const User = new Schema({
  name: String,
  email: String,
  created: { type: Date, default: Date.now },
});

User.plugin(passportLocalMongoose, {
  usernameField: "name",
  usernameQueryFields: ["name", "email"],
});

const Order = new Schema({
  email: String,
  products: [String],
  quantities: [Number],
  prices: [Number],
  created: { type: Date, default: Date.now },
});

// const StockEntry = new Schema({
//   id: String,
//   stock: Number
// });

// const StockData = new Schema({
//   entries: [StockEntry]
// })

module.exports = {
  User: mongoose.model("users", User),
  Order: mongoose.model("orders", Order),
  // ,StockData: mongoose.model("stocks", StockData)
};
