"use strict";

var Comment = require("../models/Comment");
 
var controller = {
    //METODO PARA GUARDAR LUGAR
    addComment: (req, res) => {
        let params = req.body; //recoger parametros por post
        /* console.log(params); */
        try {
            var comment = new Comment();                    //creo objeto a guardar
            comment.client = params.client;                   //Asignar valores
            comment.company = params.company;
            comment.position = params.position;
            comment.comment = params.comment;
            comment.save((err, commentStored) => {
                //Guardar articulo
                if (err || !commentStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "Los Datos no se han guardado"
                    });
                }
                return res.status(200).send({
                    //Devolver la respuesta si todo salio bien
                    status: "success",
                    comment: commentStored
                });
            });
        } catch (error) {
            return res.status(200).send({
                status: "error",
                message: error
            });
        }
    },

    /* getCenso: (req, res) => {
        var censoId = req.params.id;
        if (!censoId || censoId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el lugar"
            });
        }
        Censo.findById(censoId).exec((err, censo) => {
            if (err || !censo) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el Place"
                });
            }
            return res.status(200).send({
                status: "success",
                censo
            });
        });
    }, */

    getComments: (req, res) => {
        var query = Comment.find({});
        query.sort("-_id").exec((err, comments) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los Comments"
                });
            }
            if (!comments) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay Comments para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                comments
            });
        });
    },

};



module.exports = controller;