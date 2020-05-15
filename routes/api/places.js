'use strict'

var express = require('express');
var PlaceController = require('../../controllers/place');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/places'})

router.post('/save', PlaceController.savePlace);
router.get('/allplaces', PlaceController.getPlaces);
router.get('/allplaces/:last?', PlaceController.getPlaces);
router.get('/place/:id/packs', PlaceController.getPlaceWithPacks);
router.get('/place/:id', PlaceController.getPlace);
router.put('/place/:id', PlaceController.updatePlace);
router.delete('/place/:id', PlaceController.deletePlace);
router.post('/upload-image/:id', md_upload, PlaceController.uploadImagePlace);
router.get('/get-image/:image', PlaceController.getImagePlace);
router.get('/search/:search', PlaceController.searchPlace);

module.exports = router;