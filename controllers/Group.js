"use strict";

var Group = require("../models/Group");

var controller = {

    //METODO PARA GUARDAR GRUPO
    addGroup: (req, res) => {
        let params = req.body;                              //recoger parametros
        try {
            var group = new Group();                        //creo objeto a guardar
            group.name = params.name;                   //Asignar valores
            group.teacher = params.teacher;
            group.save((err, groupStored) => {              //Guardar articulo
                if (err || !groupStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "Los Datos no se han guardado"
                    });
                }
                return res.status(200).send({               //Devolver la respuesta si todo salio bien
                    status: "success",
                    group: groupStored
                });
            });
        } catch (error) {
            return res.status(404).send({
                status: "error",
                message: error.message
            });
        }
    },
    //METODO PARA OBTENER UN GRUPO
    getGroup: (req, res) => {
        var groupId = req.params.id;
        if (!groupId || groupId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el lugar"
            });
        }
        Group.findById(groupId).exec((err, group) => {
            if (err || !group) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el Place"
                });
            }
            return res.status(200).send({
                status: "success",
                group
            });
        });
    },
    //METODO PARA OBTENER TODOS LOS GRUPOS
    getGroups: (req, res) => {
        var query = Group.find({});
        query.sort("-_id").exec((err, groups) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los Grupos"
                });
            }
            if (!groups) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay Grupos para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                groups
            });
        });
    },
    //METODO PARA ELIMINAR UN GRUPO
    deleteGroup: (req, res) => {
        var groupId = req.params.id;
        Group.findOneAndDelete({ _id: groupId }, (err, groupDeleted) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Los Datos no se han borrado"
                });
            }
            if (!groupDeleted) {
                return res.status(404).send({
                    status: "error",
                    message: "El Grupo a borrar no existe"
                });
            }
            return res.status(200).send({
                status: 'success',
                group: groupDeleted
            });
        });
    },
    //METODO PARA EDITAR UN GRUPO
    updateGroup: (req, res) => {
        var groupId = req.params.id;
        var params = req.body; //recoger parametros del grupo
        Group.findOneAndUpdate({ _id: groupId }, params, { new: true }, (err, groupUpdated) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Los Datos no se han actualizado"
                });
            }
            if (!groupUpdated) {
                return res.status(404).send({
                    status: "error",
                    message: "El Grupo a actualizar no existe"
                });
            }
            return res.status(200).send({
                status: "success",
                group: groupUpdated
            });
        });
    },



};



module.exports = controller;