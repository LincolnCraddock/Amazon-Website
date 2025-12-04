// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const OrderSchema = new Schema({
//     name: {type: String, required: true},
//     itemName: [{type: String, require: true, unique: true}],
//     stock: [{type: String, required: true}],
//     price: [{type: Number, required: true}] ,

// });

// module.exports = mongoose.model("Order", OrderSchema);

// =======================
// Import Dependencies
// =======================

// 'mongoose' is a popular Node.js library that lets us connect to a MongoDB database
// and define the structure (schema) of the documents we will store there.
const mongoose = require("mongoose");

// =======================
// Define Schema
// =======================

// A Schema is like a "blueprint" for what data a collection should hold.
// Think of it as defining the columns and data types if this were a SQL table.
const Schema = mongoose.Schema;

const Order = new Schema({
  email: String,
  products: [String],
  quantities: [Number],
  prices: [Number],
  created: { type: Date, default: Date.now },
});

// =======================
// Export Model
// =======================

// Here we create and export the actual Mongoose model based on our schema.
// 'mongoose.model()' takes two arguments:
//   1. The name of the collection in the database ('orderinfos')
//   2. The schema that defines how the documents look ('Order')
//
// This lets other files in your project do:
//     const Order = require('./path/to/this/file');
//     Order.find(...), etc.
module.exports = mongoose.model("orderinfos", Order);
