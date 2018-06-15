var Shop = require('../schema/shopSchema');

var haravanAPI = require('haravan-node-api');

var config = {
    shop: 'suplo-fresh.myharavan.com',
    haravan_api_key: 'ab8188420bb6dc2621edef1c7e9f194b',
    haravan_shared_secret: '276e2cdc2a0d7ae3267fe303ead9ffd5',
    access_token: 'ITSWdNSpE4UxdqX2URyNznoLN9lxmFFOCHsNaWPkKaL7fcQaEXtjuLHInpWQnGpn-8TUupPyK6FE_wWLgzQVGQ4VFASsYd7x7Mvw9pOUqvIIX3yaA-IcoIwds_YclV97KSz3pkYZqyihiS6Hed2akMyWBKvqjf41CTRW35Fpa49LpuVytDnXN53zFCTvg3Boekw_7C95GRpCjwsWPVRZZHQ3azjAuwHZ9J1UEvZeE-BCIMuzJf06AvH5Rh2LxNyLd9jCT534Kz2cIMCgWT4CEcMoD-bt6Mnq36np44dq0ReM55vyZxVSlJYfYRuNoALRg8_voKHaGQkI4WkdGEq0adtbf52RB07XfW5QcPawbvv3bErlQi3inbsw-au1yZ8CjQnHRuhmxldijK7s32Tgan3e14u_eidwhodc2XiHHv1n3x1e3r3wDe7JvhXmySDDw-RaNB4tWohCH30ExMU4fLsoqPdw30cM27EcPna0frXBaHOGtS1gk4XFt2rj8hhRpJdUo4lSFfMyxk_NkMTkbMfLg1U'
}

// var config = {
//     shop: 'suplo-fresh.myharavan.com',
//     haravan_api_key: 'ab8188420bb6dc2621edef1c7e9f194b',
//     haravan_shared_secret: '276e2cdc2a0d7ae3267fe303ead9ffd5',
//     haravan_scope: 'write_products, read_products, read_content',
//     redirect_uri: 'http://localhost:8080/finish_auth'
// }

var haravan = new haravanAPI(config);


exports.addProduct = function(req, res){
    haravan.post('/admin/products.json', req.body, function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.getList = function(req, res){
	haravan.get('/admin/products.json', function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.getDetail = function(req, res){
	haravan.get('/admin/products/' + req.params.id + '.json', function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.editProduct = function(req, res){
	haravan.put('/admin/products/' + req.params.id + '.json', req.body, function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.deleteProduct = function(req, res){
	haravan.delete('/admin/products/' + req.params.id + '.json', function(err, data, headers) {
        if (err) res.send('Lỗi!')
        else res.send('Xóa thành công!');
    });
}

exports.installApp = function(req, res) {
    var auth_url = haravan.buildAuthURL();
    res.redirect(auth_url);
}

exports.finishAuth = function(req, res){
	var query_params = req.query;
    haravan.exchange_temporary_token(query_params, function(err, data) {
        res.send(data);
        // var info = {
        //     shop: query_params.shop,
        //     access_token: data.access_token
        // }
        // Shop.findOneAndUpdate({shop: query_params.shop}, info, {new: true}, function(err, result) {
        //     if (result == null) {
        //         var shopInfo = new Shop(info);
        //         shopInfo.save(function(err){
        //             if(err){
        //                 res.send(err);
        //                 return;
        //             }
        //             res.send(shopInfo);
        //         });
        //     } else {
        //         res.send(result);
        //     }
        // });
    });
}

exports.checkInstall = function(req, res, next) {
    Shop.findOne({ shop: 'suplo-fresh.myharavan.com' },function(err, result){
        if (result == null) {
            return res.status(401).json({ message: 'Shop cua ban chua cai ung dung nay!' });
        } else {
            config = {
                shop: result.shop,
                haravan_api_key: 'e7bfe3c2844afe761be924d9e196b484',
                haravan_shared_secret: '54e8aa4c4f054f526500d3a14e637abc',
                access_token: result.access_token
            }
            next();
        }
    });
}


exports.addImage = function(req, res){
	haravan.post('/admin/products/' + req.params.id + '/images.json', req.body, function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.getImage = function(req, res){
	haravan.get('/admin/products/' + req.params.id + '/images.json', function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.getCollections = function(req, res){
    haravan.get('/admin/custom_collections.json?page=' + req.query.page + '&limit=' + req.query.limit, function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.addProductToCollection = function(req, res){
    haravan.post('/admin/collects.json', req.body, function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}

exports.findCollection = function(req, res){
    haravan.get('/admin/custom_collections.json', function(err, data, headers) {
        if (err) res.send(err);
        else res.send(data);
    });
}