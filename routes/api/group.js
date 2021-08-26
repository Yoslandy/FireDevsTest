'use strict'

var express = require('express');
var GroupController = require('../../controllers/Group');

var router = express.Router();

router.post('/addGroup', GroupController.addGroup);
router.get('/get/allGroup', GroupController.getGroups);
router.get('/get/:id', GroupController.getGroup);
router.delete('/delete/:id', GroupController.deleteGroup);
router.put('/update/:id', GroupController.updateGroup);

module.exports = router;