"use strict";

var validator = require("validator");
var Censo = require("../models/Censo");
var Pack = require("../models/Pack");
var Comment = require("../models/Comment");

var controller = {
    //METODO PARA GUARDAR LUGAR
    addCenso: (req, res) => {
        var params = req.body; //recoger parametros por post
        try {
            var censo = new Censo();                    //creo objeto a guardar
            censo.name = params.name;                   //Asignar valores
            censo.lastname = params.lastname;
            censo.email = params.email;
            censo.phone = params.phone;                 //direccion de la imagen en la nube en AWS Amazon S3
            censo.age = params.age;    //nombre original de la imagen
            censo.arrival_date = params.arrival_date;    //nombre original de la imagen
            censo.status = params.status;    //nombre original de la imagen
            censo.register_no = params.register_no;    //nombre original de la imagen
            censo.save((err, censoStored) => {
                //Guardar articulo
                if (err || !censoStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "Los Datos no se han guardado"
                    });
                }
                return res.status(200).send({
                    //Devolver la respuesta si todo salio bien
                    status: "success",
                    censo: censoStored
                });
            });
        } catch (error) {
            return res.status(200).send({
                status: "error",
                message: error
            });
        }
    },

    getCensos: (req, res) => {
        var query = Censo.find({});
        /* var home = req.params.home;
        if (home || home != undefined) {
            query.limit(4);
        } */
        query.sort("-_id").exec((err, censos) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los Censos"
                });
            }
            if (!censos) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay Places para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                censos
            });
        });
    },

    getPlace: (req, res) => {
        var placeId = req.params.id;
        /* console.log(placeId); */
        if (!placeId || placeId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el lugar"
            });
        }
        Place.findById(placeId).populate('comments').exec((err, place) => {
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
        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: err
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
            Comment.deleteMany({ place: { $in: placeId } }, () => {
            });
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
        }).populate('comments')
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

    /* Este metodo no cumple ninguna funcion actualmente pero lo mantengo por si necesito 
    saber a cuando paquetes pertence un lugar*/
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

    addLike: (req, res) => {
        var placeId = req.params.id_place;
        var userId = req.params.id_user;
        Place.findOneAndUpdate({ _id: placeId }, { $push: { likes: userId } }, { new: true }, (err, updated) => {
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

    deleteLike: (req, res) => {
        var placeId = req.params.id_place;
        var userId = req.params.id_user;
        Place.findOneAndUpdate({ _id: placeId }, { $pull: { likes: userId } }, { new: true }, (err, updated) => {
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

    saveCommentPlace: (req, res) => {
        var params = req.body; //recoger parametros por post
        var placeId = req.params.id_place;
        try {
            var objcomment = new Comment();                    //creo objeto a guardar
            objcomment.comment = params.comment;                   //Asignar valores
            objcomment.rating = params.rating;
            objcomment.user = params.user;
            objcomment.place = params.place
            objcomment.save((err, commentStored) => {
                //Guardar articulo
                if (err || !commentStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "Los Datos no se han guardado"
                    });
                }
                Place.findOneAndUpdate({ _id: placeId }, { $push: { comments: commentStored._id } }, { new: true }, () => {
                    return res.status(200).send({
                        //Devolver la respuesta si todo salio bien
                        status: "success",
                        comment: commentStored
                    });
                });
            });
        } catch (error) {
            return res.status(200).send({
                status: "error",
                message: error
            });
        }
    },
};

module.exports = controller;