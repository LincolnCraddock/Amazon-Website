const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    name: {type: String, required: true},
    itemName: {type: String, require: true, unique: true}, 
    stock: {type: String, required: true}
}); 


module.exports = mongoose.model("Order", OrderSchema);
