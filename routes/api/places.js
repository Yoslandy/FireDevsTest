'use strict'

var express = require('express');
var PlaceController = require('../../controllers/place');

var router = express.Router();

router.post('/save', PlaceController.savePlace);
router.get('/allplaces', PlaceController.getPlaces);
router.get('/allplaces/:last?', PlaceController.getPlaces);
router.get('/place/:id/packs', PlaceController.getPlaceWithPacks);
router.get('/place/:id', PlaceController.getPlace);
router.put('/place/:id', PlaceController.updatePlace);
router.delete('/place/:id', PlaceController.deletePlace);
router.get('/search/:search', PlaceController.searchPlace);

module.exports = router;