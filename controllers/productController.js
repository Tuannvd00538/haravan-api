var Shop = require('../schema/shopSchema');

var haravanAPI = require('haravan-node-api');

// var config = {
//     shop: 'suplo-fresh.myharavan.com',
//     haravan_api_key: 'e7bfe3c2844afe761be924d9e196b484',
//     haravan_shared_secret: '54e8aa4c4f054f526500d3a14e637abc',
//     access_token: 'lUmHrpGh2yonhTJQe3XX6Sm9gZzWAkHHRxd9sYN6xveb9c_byTwAyTbmT6TAtG0PZvSXPB123WaqZfJfFowG_v__wXb39XZ9iFCkbxGYs9_RvamAUdFDZVZJMd8C2dODwp9UmQ4c292Q3E1cZe20Iz1elGZPhsd2jGvEdAcmCo4nNRxNbCKj9-NFWXbwMr_llDq0NbyF9F5hpVF5CR_0sjPZBgT6HsduZyns1CtVmqPlyJjVIEgJpIxVWr6uquSqePaqeHpTcrJ5XQxvdREPhCP4NGMwIavdmJEKZPWO4BjbtYHzgHsoWudt1tWPLrQYfJm_o27FVczBDOPppb06-z3bnXKZ_KPKUO1JFJ_43iu9T22w9t99SL8Gi-GRGJA9tRKY-ndWbCwboFrNW_4tvJP7fyL7gPlCiXHR_71yoDhjiXmRbmybT02yJWEDlxp3Sv3tR16B-faXAZBKakGNWzOZ5ihC3mct0VLvAnjFyske-_tfD87CjE4sbnx0skyg1Ot1Pw'
// }

var config = {
    shop: 'suplo-fresh.myharavan.com',
    haravan_api_key: 'e7bfe3c2844afe761be924d9e196b484',
    haravan_shared_secret: '54e8aa4c4f054f526500d3a14e637abc',
    haravan_scope: 'write_products, read_products, read_content',
    redirect_uri: 'http://localhost:8080/finish_auth'
}

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
        var info = {
            shop: query_params.shop,
            access_token: data.access_token
        }
        Shop.findOneAndUpdate({shop: query_params.shop}, info, {new: true}, function(err, result) {
            if (result == null) {
                var shopInfo = new Shop(info);
                shopInfo.save(function(err){
                    if(err){
                        res.send(err);
                        return;
                    }
                    res.send(shopInfo);
                });
            } else {
                res.send(result);
            }
        });
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