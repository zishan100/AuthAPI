const UserProfile = require('../Model/user');
const Product = require('../Model/product');
const {validationResult} = require('express-validator');

exports.AddProductByAdmin =async(req,res,next) => {
      
    let headers = req.user;
     
    try {
        let Validate = validationResult(req);
        if (!Validate.isEmpty()) {
                 
            return res.status(400).json({
                msg: Validate.array()
            });
        }
        let { title, price, description, color, size } = req.body;
        let user = await UserProfile.findOne({ $and: [{ email: headers }, { isAdmin: { $eq: 'admin' } }] });
        
        if (!user)
            return res.status(400).json('only admin user allowed to Add Product into `Store');
        
        console.log(user);
        console.log("product details-->", req.body);
         
        let product = new Product({
            title: title,
            description: description,
            price: price,
            color: color !== undefined ? color : undefined,
            size: size !== undefined ? size : undefined
        });
        
        let prod = await product.save();
        
        user.Prod.push(prod);
        
        await user.save();
        
        res.status(200).json({
            msg: 'product added succesfully...'
        });
       
    } catch (err) {
        
        if (err) {
 
            if (err.code === 11000) {
                return res.status(500).json({
                    msg: "This title of Product is Already Taken by Someone else..."
                });
             
            }
            res.status(422).json({
                msg: 'something error in server !!!'
            });
        }
    }
}












