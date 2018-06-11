var mongoose = require('mongoose');

module.exports = mongoose.model('authentications', {
	shop: {
		type: String,
		require: true
	},
	access_token: {
		type: String,
		require: true
	}
});