'use strict';
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
const port = 8080;
const cors = require('cors');

app.use(express.static('./app'));

var admin = require("firebase-admin");

const firebase = require('firebase');
const googleStorage = require('@google-cloud/storage');
const Multer = require('multer');

const storage = googleStorage({
  	projectId: "haravan-suplo-app",
  	keyFilename: "./suplo.json"
});

const bucket = storage.bucket("haravan-suplo-app.appspot.com");

const multer = Multer({
  	storage: Multer.memoryStorage(),
  	limits: {
    	fileSize: 5 * 1024 * 1024
  	}
});

app.post('/_api/image', multer.single('file'), (req, res) => {

  	console.log('Upload Image');

  	let file = req.file;
  	if (file) {
	    uploadImageToStorage(file).then((success) => {
	      	res.send(success);
	    }).catch((error) => {
	      	console.error(error);
	    });
  	}
});

app.delete('/_api/image', (req, res) => {
	var bucketName = req.query.bucket;
	var filename = req.query.name;
	storage.bucket(bucketName).file(filename).delete().then(() => {
      	res.send('Success!');
    }).catch(err => {
      	console.error('ERROR:', err);
    });
});

const uploadImageToStorage = (file) => {
  	let prom = new Promise((resolve, reject) => {
	    if (!file) {
	      reject('No image file');
	    }
	    let newFileName = `${Date.now()}_${file.originalname}`;

	    let fileUpload = bucket.file(newFileName);

	    const blobStream = fileUpload.createWriteStream({
	      metadata: {
	        contentType: file.mimetype
	      }
	    });

	    blobStream.on('error', (error) => {
	      reject('Something is wrong! Unable to upload at the moment.');
	    });

	    blobStream.on('finish', () => {
	    	storage.bucket(bucket.name).file(fileUpload.name).makePublic().then(() => {
		      	const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
	      		resolve(url);
		    })
		    .catch(err => {
		      console.error('ERROR:', err);
		    });	      
	    });

	    blobStream.end(file.buffer);
  	});
  	return prom;
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:haravan123@ds153380.mlab.com:53380/haravan');
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(express.json());

var productRoute = require('./routes/productRoute');
productRoute(app);

app.get('/', (req, res) => res.send('<strong>Hello world!<strong>'));

app.listen(port, function() {
    console.log('Port ' + port + ': Success!');
});