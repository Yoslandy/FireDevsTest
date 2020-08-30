"use strict";

var validator = require("validator");
var Pack = require("../models/Pack");
var Place = require("../models/Place");

var controller = {
    //METODO PARA GUARDAR LUGAR
    savePack: (req, res) => {
        var params = req.body; //recoger parametros por post
        try {
            //validar datos (validator)
            var validate_name = !validator.isEmpty(params.name);
            var validate_description = !validator.isEmpty(params.description);
        } catch (err) {
            //si no se cumplen las condiciones lanzo mensaje de error
            return res.status(404).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }
        if (validate_name && validate_description) {
            //Si todo es verdadero...
            var pack = new Pack(); //creo objeto a guardar
            pack.name = params.name; //Asignar valores
            pack.description = params.description;
            pack.image = params.image;
            pack.image_name = params.image_name;
            pack.save((err, packStored) => {
                //Guardar articulo
                if (err || !packStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "Los Datos no se han guardado"
                    });
                }
                return res.status(200).send({
                    //Devolver la respuesta si todo salio bien
                    status: "success",
                    pack: packStored
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

    getPacks: (req, res) => {
        var query = Pack.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(1);
        }
        query.sort("-_id").exec((err, packs) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los Packs"
                });
            }
            if (!packs) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay Packs para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                packs
            });
        });
    },

    getPack: (req, res) => {
        var packId = req.params.id;
        if (!packId || packId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el lugar"
            });
        }
        Pack.findById(packId, (err, pack) => {
            if (err || !pack) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el Place"
                });
            }
            return res.status(200).send({
                status: "success",
                pack: pack
            });
        });
    },

    updatePack: (req, res) => {
        var packId = req.params.id;
        var params = req.body; //recoger parametros por post
        try {
            //validar datos (validator)
            var validate_name = !validator.isEmpty(params.name);
            var validate_desc = !validator.isEmpty(params.description);
        } catch (err) {
            //si no se cumplen las condiciones lanzo mensaje de error
            return res.status(404).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }
        if (validate_name && validate_desc) {
            //Si todo es verdadero...
            Pack.findOneAndUpdate({ _id: packId }, params, { new: true }, (err, PackUpdated) => {
                //Guardar articulo
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Los Datos no se han actualizado"
                    });
                }
                if (!PackUpdated) {
                    return res.status(404).send({
                        status: "error",
                        message: "El lugar a actualizar no existe"
                    });
                }
                return res.status(200).send({
                    //Devolver la respuesta si todo salio bien
                    status: "success",
                    pack: PackUpdated
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

    deletePack: (req, res) => {
        var packId = req.params.id;

        Pack.findOneAndDelete({ _id: packId }, (err, packDeleted) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Los Datos no se han borrado"
                });
            }

            if (!packDeleted) {
                return res.status(404).send({
                    status: "error",
                    message: "El pack a borrar no existe"
                });
            }
            Place.updateMany({}, { $pull: { packs: packId } }, { new: true }, () => {

            });
            return res.status(200).send({
                status: 'success',
                pack: packDeleted
            });
        });
    },
    
    searchPack: (req, res) => {
        var searchString = req.params.search;
        Pack.find({
            "$or": [
                { "name": { "$regex": searchString, "$options": "i" } },
                { "description": { "$regex": searchString, "$options": "i" } },
            ]
        })
            .exec((err, pack) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al cargar los lugares"
                    });
                }
                if (!pack || pack.length <= 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "No existen lugares para esta busqueda",
                        packs: []
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    packs: pack
                });
            });
    },

    updatePackWithPlace: (req, res) => {
        var packId = req.params.id;
        var placeId = req.params.id_place;

        Place.findOneAndUpdate({ _id: placeId }, { $push: { packs: packId } }, { new: true }, () => {

        });
        Pack.findOneAndUpdate({ _id: packId }, { $push: { places: placeId } }, { new: true }, (err, updated) => {
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

    //ELIMINO UN DETERMINADO PLACE A UN PAQUETE Y A SU VEZ EL PAQUETE AL PLACE
    deletePlaceInPack: (req, res) => {
        var packId = req.params.id;
        var placeId = req.params.id_place;
        Pack.findOneAndUpdate({ _id: packId }, { $pull: { places: placeId } }, { new: true }, (err, updated) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Los Datos no se han actualizado",
                    err
                });
            }
            Place.findOneAndUpdate({ _id: placeId }, { $pull: { packs: packId } }, { new: true }, () => {

            });
            return res.status(200).send({
                status: "success",
                message: "Actualizado con exito",
                updated
            });

        });

    },

    getPackWithPlace: (req, res) => {
        var packId = req.params.id;

        Pack.findById(packId).populate('places').exec((err, updated) => {
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