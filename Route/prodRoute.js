const route = require('express').Router();
const ProdController = require('../Controller/product');
const { Authen} = require('../Middleware/middleware');
const { ValidateProduct} = require('../Validation/prodvalidation');

route.post('/add-product', Authen, ValidateProduct(), ProdController.AddProductByAdmin);




module.exports= route;