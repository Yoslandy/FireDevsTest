'use strict'

var express = require('express');
var CensoController = require('../../controllers/censo');

var router = express.Router();

router.post('/add', CensoController.addCenso);
router.get('/allCensos', CensoController.getCensos);
/* router.get('/allplaces/:home?', PlaceController.getPlaces);
router.get('/place/:id/packs', PlaceController.getPlaceWithPacks);
router.get('/place/:id', PlaceController.getPlace);
router.put('/place/:id', PlaceController.updatePlace);
router.delete('/place/:id', PlaceController.deletePlace);
router.get('/search/:search', PlaceController.searchPlace);
router.post('/place/:id_place/user/:id_user', PlaceController.addLike);
router.put('/place/:id_place/user/:id_user', PlaceController.deleteLike);
router.post('/place/comment/:id_place', PlaceController.saveCommentPlace); */

module.exports = router;