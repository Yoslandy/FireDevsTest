"use strict";

var validator = require("validator");
var Place = require("../models/Place");
var Pack = require("../models/Pack");
var fs = require('fs');
var path = require('path');

var controller = {
    //METODO PARA GUARDAR LUGAR
    savePlace: (req, res) => {
        var params = req.body; //recoger parametros por post
        try {
            //validar datos (validator)
            var validate_name = !validator.isEmpty(params.name);
            var validate_city = !validator.isEmpty(params.city);
        } catch (err) {
            //si no se cumplen las condiciones lanzo mensaje de error
            return res.status(404).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }
        if (validate_name && validate_city) {
            //Si todo es verdadero...
            var place = new Place();                    //creo objeto a guardar
            place.name = params.name;                   //Asignar valores
            place.city = params.city;
            place.image = params.image;                 //direccion de la imagen en la nube en AWS Amazon S3
            place.image_name = params.image_name;    //nombre original de la imagen
            place.save((err, placeStored) => {
                //Guardar articulo
                if (err || !placeStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "Los Datos no se han guardado"
                    });
                }
                return res.status(200).send({
                    //Devolver la respuesta si todo salio bien
                    status: "success",
                    place: placeStored
                });
            });
        } else {
            //Sino lanzo error
            return res.status(200).send({
                status: "error",
                message: "Los Datos no son Validados"
            });
        }
    },

    getPlaces: (req, res) => {
        var query = Place.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(3);
        }
        query.sort("-_id").exec((err, places) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los Places"
                });
            }
            if (!places) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay Places para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                places
            });
        });
    },

    getPlace: (req, res) => {
        var placeId = req.params.id;
        if (!placeId || placeId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el lugar"
            });
        }
        Place.findById(placeId, (err, place) => {
            if (err || !place) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el Place"
                });
            }
            return res.status(200).send({
                status: "success",
                place
            });
        });
    },

    updatePlace: (req, res) => {
        var placeId = req.params.id;
        var params = req.body; //recoger parametros por post
        try {
            //validar datos (validator)
            var validate_name = !validator.isEmpty(params.name);
            var validate_city = !validator.isEmpty(params.city);
        } catch (err) {
            //si no se cumplen las condiciones lanzo mensaje de error
            return res.status(404).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }
        if (validate_name && validate_city) {
            //Si todo es verdadero...
            Place.findOneAndUpdate({ _id: placeId }, params, { new: true }, (err, placeUpdated) => {
                //Guardar articulo
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Los Datos no se han actualizado"
                    });
                }
                if (!placeUpdated) {
                    return res.status(404).send({
                        status: "error",
                        message: "El lugar a actualizar no existe"
                    });
                }
                return res.status(200).send({
                    //Devolver la respuesta si todo salio bien
                    status: "success",
                    place: placeUpdated
                });
            });
        } else {
            //Sino lanzo error
            return res.status(200).send({
                status: "error",
                message: "Los Datos no son Validados"
            });
        }
    },

    deletePlace: (req, res) => {
        var placeId = req.params.id;
        Place.findOneAndDelete({ _id: placeId }, (err, placeDeleted) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Los Datos no se han borrado"
                });
            }
            if (!placeDeleted) {
                return res.status(404).send({
                    status: "error",
                    message: "El lugar a borrar no existe"
                });
            }
            Pack.updateMany({}, { $pull: { places: placeId } }, { new: true }, () => {
            });
            return res.status(200).send({
                status: 'success',
                place: placeDeleted
            });
        });
    },

    searchPlace: (req, res) => {
        var searchString = req.params.search;
        /* console.log(searchString); */
        Place.find({
            "$or": [
                { "name": { "$regex": searchString, "$options": "i" } },
                { "city": { "$regex": searchString, "$options": "i" } },
            ]
        })
            .exec((err, places) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al cargar los lugares"
                    });
                }
                if (!places || places.length <= 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "No existen lugares para esta busqueda",
                        places: []
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    places
                });
            });
    },

    getPlaceWithPacks: (req, res) => {
        var placeId = req.params.id;
        Place.findById(placeId).populate('packs').exec((err, updated) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Los Datos no se han actualizado"
                });
            }
            return res.status(200).send({
                status: "success",
                message: "Actualizado con exito",
                updated
            });
        });
    },

};

module.exports = controller;