'use strict'

var express = require('express');
var StudentController = require('../../controllers/Student');

var router = express.Router();

router.post('/addStudent', StudentController.addStudent);
router.get('/get/allStudents', StudentController.getStudents);
router.get('/get/:id', StudentController.getStudent);
router.delete('/delete/:id', StudentController.deleteStudent);
router.put('/update/:id', StudentController.updateStudent);

module.exports = router;