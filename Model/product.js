const Mongoose = require('mongoose');

const ProductSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required:true 
    },
    price: {
        type: Number,
        required:true  
    },
    size: String,
    color: String,
},{timestamps:true})

module.exports = Mongoose.model('product',ProductSchema);
