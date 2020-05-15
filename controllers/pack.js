"use strict";

var validator = require("validator");
var Pack = require("../models/Pack");
var Place = require("../models/Place");
var fs = require('fs');
var path = require('path');

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
            pack.image = null;
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
                    place: packStored
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
        query.sort("-_id").exec((err, pack) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los Packs"
                });
            }
            if (!pack) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay Packs para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                pack
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
            var path_file = './upload/pack/' + packDeleted.image;
            fs.unlink(path_file, () => {
                /* Place. */
                return res.status(200).send({
                    status: 'success',
                    pack: packDeleted
                });
            });
        });
    },

    uploadImagePack: (req, res) => {
        //configurar connect multiparty en router.pack.js
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\'); //Si usas linux o mac ('/')

        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            fs.unlink(file_path, () => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extencion no es valida'
                });
            })
        } else {
            var packId = req.params.id

            Pack.findOneAndUpdate({ _id: packId }, { image: file_name }, { new: true }, (err, imageUpdated) => {

                if (err || !imageUpdated) {
                    fs.unlink(file_path, () => {})
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen en el PLace'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    pack: imageUpdated
                });
            })
        }
    },

    getImagePack: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/pack/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'la imagen no existe'
                });
            }
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
                    return res.status(404).send({
                        status: "error",
                        message: "No existen lugares para esta busqueda"
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
        /* return res.status(200).send({
            status: "success",
            message: "Actualizado con exito",
        }); */
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