'use strict'

var express = require('express');
var CensoController = require('../../controllers/censo');
const auth = require('../../middleware/auth');

var router = express.Router();

router.post('/add', CensoController.addCenso);
router.get('/allCensos', CensoController.getCensos);
router.get('/:id', CensoController.getCenso);

module.exports = router;