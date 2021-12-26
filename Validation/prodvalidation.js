const { body } = require('express-validator');

exports.ValidateProduct = () => {
    return [
        body('title').isLength({ min: 3 }).withMessage('title field required'),
        body('description').isLength({ min: 3 }).withMessage('description field required'),
        body('price').isNumeric().withMessage('price field required')
     ]
}
