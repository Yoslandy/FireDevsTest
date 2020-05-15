'use strict'

var express = require('express');
var PackController = require('../../controllers/pack');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/pack' })

router.post('/save', PackController.savePack);
router.post('/pack/:id/place/:id_place', PackController.updatePackWithPlace); //Estos dos metodos no estan en places
router.put('/pack/:id/place/:id_place', PackController.deletePlaceInPack); //
router.get('/allpacks', PackController.getPacks);
router.get('/allpacks/:last?', PackController.getPacks);
router.get('/pack/:id', PackController.getPack);
router.get('/pack/:id/places', PackController.getPackWithPlace);
router.put('/pack/:id', PackController.updatePack);
router.delete('/pack/:id', PackController.deletePack);
router.post('/upload-image/:id', md_upload, PackController.uploadImagePack);
router.get('/get-image/:image', PackController.getImagePack);
router.get('/search/:search', PackController.searchPack);

module.exports = router;