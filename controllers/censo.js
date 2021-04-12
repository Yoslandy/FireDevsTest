"use strict";

var Censo = require("../models/Censo");
 
var controller = {
    //METODO PARA GUARDAR LUGAR
    addCenso: (req, res) => {
        let params = req.body; //recoger parametros por post
        /* console.log(params); */
        try {
            var censo = new Censo();                    //creo objeto a guardar
            censo.name = params.name;                   //Asignar valores
            censo.subcontent = params.subcontent;
            censo.content = params.content;
            censo.type = params.type;
            censo.url = params.url;
            censo.date = params.date;
            censo.client = params.client;
            censo.image = params.image;
            censo.images = params.images;
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

    getCenso: (req, res) => {
        var censoId = req.params.id;
        /* console.log(placeId); */
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
    },

    getCensos: (req, res) => {
        var query = Censo.find({});
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

};



module.exports = controller;