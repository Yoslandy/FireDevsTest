"use strict";

var Censo = require("../models/Censo");

var controller = {
    //METODO PARA GUARDAR LUGAR
    addCenso: (req, res) => {
        var params = req.body; //recoger parametros por post
        try {
            var censo = new Censo();                    //creo objeto a guardar
            censo.name = params.name;                   //Asignar valores
            censo.lastname = params.lastname;
            censo.email = params.email;
            censo.phone = params.phone;
            censo.age = params.age;
            censo.arrival_date = params.arrival_date;
            censo.status = params.status;
            censo.image = params.image;                     //direccion de la imagen en la nube en AWS Amazon S3
            censo.image_name = params.image_name;           //nombre original de la imagen
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