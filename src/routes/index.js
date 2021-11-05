import express, { Router } from "express";
import registerController from "../controllers/registerController";
import validation from "../validation/registerValidation";
import loginController from "../controllers/loginController";
import userController from "../controllers/userController";
import adminController from "../controllers/adminController";
import path from "path";

// const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser');
// const { json } = require('body-parser');

const connection = require('../configs/connectDB');

let router = express.Router();

let Routes = (app) => {
    //RUTAS PARA LA PÁGINA DE LOGIN
    router.get("/", loginController.ObtenerPaginaInicio);
    router.get("/Inicio", loginController.ObtenerPaginaInicio);
    router.post("/Inicio", loginController.Inicio);
    router.post("/Fin", loginController.CerrarSesion);

    //RUTAS PARA LA PÁGINA DE REGISTRO
    router.get("/registro", registerController.ObtenerPaginaRegistro);
    router.post("/registro", registerController.CrearUsuario);
 
    //RUTAS QUE REDIRECCIONAN A LA PÁGINA PRINCIPAL DE CADA MÓDULO   
    router.get("/usuario/usuario", userController.getUser);
    router.get("/admin/admin", adminController.getAdmin);
   
    //RUTAS PARA LA PÁGINA DE USUARIO    
    router.post('/Especialidad', userController.OpcionesEspe);
    router.post('/Doctor', userController.OpcionesDr);
    router.post('/listaEPS', userController.OpcionesEPS);
    router.post('/OpcionesHorario',userController.OpcionesHorario);
    //router.post('/datosHorario',userController.AgendaHorario);
    router.post('/EnviarDatos',userController.SolicitarCita);
    router.post('/InfoTabla', userController.TablaHorario)
    //router.post('/InfoTabla',userController.LlenarTablaHorario);

    //RUTAS PARA LA PÁGINA DE ADMINISTRADOR  
    router.get('/Solicitudes',adminController.Solicitudes);
    router.post('/ListaMedico',adminController.medicina);
    router.post('/ListaOdontologo',adminController.odontologia);
    router.post('/createAgendaMed',adminController.AgendaMed);
    router.post('/createAgendaOdont',adminController.AgendaOdont); 
    
    router.post('/SolicitudIndividual',adminController.SolicitudesIndivial);
    router.post('/RechazarSolicitud',adminController.Rechazar);

    return app.use("/", router);
};




// router.get('/registrodeusuario', (req, res) => {
//     res.render('register.ejs');
    
//     //res.send('HELLO, I CANNOT SPEAK ENGLISH FLUENTLY, FOR THIS REASON I CONSIDER THAT I NEED SOME HELP');
// })




module.exports = Routes;