'use strict'

var express = require('express');
var CensoController = require('../../controllers/censo');

var router = express.Router();

router.post('/add', CensoController.addCenso);
router.get('/allCensos', CensoController.getCensos);

module.exports = router;