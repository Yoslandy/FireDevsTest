"use strict";

var Student = require("../models/Student");
var Group = require("../models/Group");

var controller = {
    //METODO PARA GUARDAR ESTUDIANTE
    addStudent: (req, res) => {
        let params = req.body;                              //recoger parametros por post
        try {
            var student = new Student();                      //creo objeto a guardar
            student.name = params.name;                       //Asignar valores
            student.email = params.email;
            student.sex = params.sex;
            student.age = params.age;
            student.dateBirth = params.dateBirth;
            student.cityBirth = params.cityBirth;
            student.group = params.grupo;
            student.save((err, studentStored) => {              //Guardar articulo
                if (err || !studentStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "Los Datos no se han guardado"
                    });
                }
                Group.findOneAndUpdate({ _id: params.grupo/* ._id */ }, { $push: { students: studentStored._id } }, { new: true }, () => {
                    return res.status(200).send({               //Devolver la respuesta si todo salio bien
                        status: "success",
                        student: studentStored
                    });
                });
            });
        } catch (error) {
            return res.status(404).send({
                status: "error",
                message: error.message
            });
        }
    },
    //METODO PARA OBTENER UN ESTUDIANTE
    getStudent: (req, res) => {
        var studentId = req.params.id;
        if (!studentId || studentId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el estudiante"
            });
        }
        Student.findById(studentId).exec((err, student) => {
            if (err || !student) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el estudiante"
                });
            }
            return res.status(200).send({
                status: "success",
                student
            });
        });
    },
    //METODO PARA OBTENER TODOS LOS ESTUDIANTES
    getStudents: (req, res) => {
        var query = Student.find({});
        query.sort("-_id").exec((err, students) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los Estudiantes"
                });
            }
            if (!students) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay Estudiantes para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                students
            });
        });
    },
    //METODO PARA ELIMINAR UN ESTUDIANTE
    deleteStudent: (req, res) => {
        var studentId = req.params.id;
        Student.findOneAndDelete({ _id: studentId }, (err, studentDeleted) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Los Datos no se han borrado"
                });
            }
            if (!studentDeleted) {
                return res.status(404).send({
                    status: "error",
                    message: "El Estudiante a borrar no existe"
                });
            }
            return res.status(200).send({
                status: 'success',
                student: studentDeleted
            });
        });
    },
    //METODO PARA EDITAR UN ESTUDIANTE
    updateStudent: (req, res) => {
        var studentId = req.params.id;
        var params = req.body; //recoger parametros del grupo
        Student.findOneAndUpdate({ _id: studentId }, params, { new: true }, (err, studentUpdated) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "El Estudiante no se han actualizado"
                });
            }
            if (!studentUpdated) {
                return res.status(404).send({
                    status: "error",
                    message: "El Estudiante a actualizar no existe"
                });
            }
            return res.status(200).send({
                status: "success",
                student: studentUpdated
            });
        });
    },

};



module.exports = controller;