import express, { Router } from "express";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import userController from "../controllers/userController";
import adminController from "../controllers/adminController";
import forgotPasswordController from "../controllers/forgotPasswordController";
import resetPasswordController from "../controllers/resetPasswordController";


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

    //RUTAS PARA FORGOT AND RESET PASSWORD 
    router.get('/forgot-passwordRest', forgotPasswordController.Rest);
    router.get('/Olvidarpassword', forgotPasswordController.forgot);
    router.post('/Olvidarpassword', forgotPasswordController.checkaccountforgot);
    router.get('/Restaurarpassword/:id/:token', resetPasswordController.RestaurarPage);
    router.post('/Restaurarpassword', resetPasswordController.ChangePassword);
   
    //RUTAS PARA LA PÁGINA DE USUARIO
    router.post('/Especialidad', userController.OpcionesEspe);
    router.post('/Doctor', userController.OpcionesDr);
    router.post('/ListaExamenesLab', userController.OpcionesLab);
    router.post('/listaEPS', userController.OpcionesEPS);
    router.post('/OpcionesHorario',userController.OpcionesHorario); 
    router.post('/OpcionesHorarioLab',userController.OpcionesHorarioLab);    
    router.post('/EnviarDatos',userController.SolicitarCita);
    router.post('/InfoTabla', userController.TablaHorario);
    router.post('/InfoTablaLab', userController.TablaHorarioLab);

    router.post('/DatosUsuarioA',userController.DatosUserA);
    router.post('/ActualizarSolicitud', userController.Actualizar);

    router.get('/ConsultarUser',userController.SolicitudUser);
    router.post('/DatosUsuario',userController.DatosUser);
    router.post('/EliminarSolicitud',userController.Eliminar);

    //RUTAS PARA LA PÁGINA DE ADMINISTRADOR  
    router.get('/Solicitudes',adminController.Solicitudes); 
    router.get('/Aceptadas',adminController.Aceptadas);    
    router.post('/ListaMedico',adminController.medicina);
    router.post('/ListaOdontologo',adminController.odontologia);
    router.post('/ListaLaboratorios',adminController.laboratorio);
    router.post('/createAgendaMed',adminController.AgendaMed);
    router.post('/createAgendaOdont',adminController.AgendaOdont); 
    router.post('/createAgendaLab',adminController.AgendaLab); 
    
    router.post('/SolicitudIndividual',adminController.SolicitudesIndivial);
    router.post('/RechazarSolicitud',adminController.Rechazar);
    router.post('/AceptarSolicitud',adminController.Aceptar);

    return app.use("/", router);
};


module.exports = Routes;