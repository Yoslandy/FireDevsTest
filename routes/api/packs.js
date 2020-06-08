'use strict'

var express = require('express');
var PackController = require('../../controllers/pack');

var router = express.Router();

router.post('/save', PackController.savePack);
router.get('/allpacks', PackController.getPacks);
router.get('/allpacks/:last?', PackController.getPacks);
router.get('/pack/:id', PackController.getPack);
router.get('/pack/:id/places', PackController.getPackWithPlace);
router.put('/pack/:id', PackController.updatePack);
router.delete('/pack/:id', PackController.deletePack);
router.get('/search/:search', PackController.searchPack);
router.post('/pack/:id/place/:id_place', PackController.updatePackWithPlace); //Estos dos metodos no estan en places
router.put('/pack/:id/place/:id_place', PackController.deletePlaceInPack); //

module.exports = router;