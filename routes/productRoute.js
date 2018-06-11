var productController = require('../controllers/productController');

module.exports = function(app){
	app.route('/_api/product')
		.post(productController.addProduct)
		.get(productController.checkInstall, productController.getList);

	app.route('/_api/product/:id')
		.get(productController.getDetail)
		.put(productController.editProduct)
		.delete(productController.deleteProduct);

	app.route('/_api/image/:id')
		.post(productController.addImage)
		.get(productController.getImage);

	app.route('/finish_auth')
		.get(productController.finishAuth);

	app.route('/install')
		.get(productController.installApp);

	app.route('/_api/collections')
		.post(productController.addProductToCollection)
		.get(productController.getCollections);

	app.route('/_api/collections/find')
		.get(productController.findCollection);
}