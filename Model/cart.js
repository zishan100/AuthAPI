const Mongoose = require('mongoose');

const CartSchema = new Mongoose.Schema({
    email: {
        type: String,
         required:true
    },
    prod_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref:'product' 
    },
    quantity: {
        type: Number,
        required:true 
    }
}, { timestamps: true })

module.exports = Mongoose.model('cart', CartSchema);
