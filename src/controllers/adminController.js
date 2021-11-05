import connection from "../configs/connectDB";
import adminService from "../services/adminService";
import gmailController from "../controllers/gmailController";
import jwt from "jsonwebtoken";

//FUNCIÓN PARA LA PÁGINA PRINCIPAL DEL MÓDULO USUARIO
let getAdmin = (req, res) => {
    if (req.session.admin) {
        return res.render("./admin/admin.ejs", {
            user: req.session.context
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
}

let medicina = (req, res) => {
    connection.query('SELECT Doctor FROM medicos WHERE Especialidad = "Medicina general" ORDER BY Doctor ASC', (err, data) => {
        if (err) {
            res.json(err);
        }
        var result = data
        res.end(JSON.stringify(result));       
    });
};

let odontologia = (req, res) => {
    connection.query('SELECT Doctor FROM medicos WHERE Especialidad = "Odontología" ORDER BY Doctor ASC', (err, data) => {
        if (err) {
            res.json(err);
        }
        var result = data
        res.end(JSON.stringify(result));       
    });
};

let AgendaMed = async (req, res) => {

    var especialidad = "Medicina general";    
    var Dia = req.body.Dia;
    var IdDia;

    if (Dia == "Lunes") {
        IdDia = "1";
    } else if (Dia == "Martes") {
        IdDia = "2"
    } else if (Dia == "Miércoles") {
        IdDia = "3"
    } else if (Dia == "Jueves") {
        IdDia = "4"
    } else if (Dia == "Viernes") {
        IdDia = "5"
    }

    let horarioMed = {   
        especialidad: especialidad,
        Medico: req.body.Medico,
        Dia: req.body.Dia,
        horaInicio: req.body.H1,
        horaFin: req.body.H2,  
        IdDia: IdDia
    };
    console.log(horarioMed)
    await adminService.crearAgendaMed(horarioMed);
    res.redirect("/admin/admin");
}

let AgendaOdont = async (req, res) => {

    var especialidad = "Odontología"; 
    var Dia = req.body.Dia1;
    var IdDia;

    if (Dia == "Lunes") {
        IdDia = "1";
    } else if (Dia == "Martes") {
        IdDia = "2"
    } else if (Dia == "Miércoles") {
        IdDia = "3"
    } else if (Dia == "Jueves") {
        IdDia = "4"
    } else if (Dia == "Viernes") {
        IdDia = "5"
    }
    
    let horarioOdont = {   
        especialidad: especialidad,
        Medico: req.body.Odontologo,
        Dia: req.body.Dia1,
        horaInicio: req.body.H3,
        horaFin: req.body.H4,  
        IdDia: IdDia
    };
    console.log(horarioOdont)
    await adminService.crearAgendaOdont(horarioOdont);
    res.redirect("/admin/admin");
}

let Solicitudes = (req, res) => {
    if (req.session.admin) {
        connection.query(`SELECT idcitas, Nombres, Apellidos, Correo, Celular, Tipo_Documento, Numero_Documento,
        Afiliacion, Regimen, Entidad, Especialidad, Doctor, DATE_FORMAT(Fecha, "%Y-%m-%d") Fecha, Hora, 
        Orden, Descripcion FROM citas WHERE Estado_cita = "Pendiente"`, (err, data) => {
            if (err) {
                res.json(err);
            }
            console.log(data);
            res.render('./admin/adminSolicitud.ejs', {
                data: data,
                //user: req.session.context               
            });
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};

let SolicitudesIndivial = (req, res) => {
    //const id = req.params.idcitas;
    var id = req.body.idC;
    if (req.session.admin) {
        connection.query(`SELECT idcitas, Nombres, Apellidos, Correo, Celular, Tipo_Documento, 
        Numero_Documento, Afiliacion, Regimen, Entidad, Especialidad, Doctor, 
        DATE_FORMAT(Fecha, "%Y-%m-%d") Fecha, MONTHNAME(Fecha) Mes, DAY(Fecha) Dia, YEAR(Fecha) Año, 
        Hora, DATE_FORMAT(Hora, "%I:%i : %p") Hora12, Orden, Descripcion FROM citas WHERE idcitas = ?`, [id], (err, datos) => {
            if (err) {
                res.json(err);
            }
            console.log(datos);
            var datos = datos
            res.end(JSON.stringify(datos));  
            // res.render('./admin/adminSolicitud.ejs', {
            //     datos: data[0]
            // });
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};

let Rechazar = async (req, res) => {

    const estado = 'Rechazada';
    const datos = req.body;
    const id = req.body.id;
    console.log(datos)

    let variablesRechazar = {
        correo: req.body.correo,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        especialidad: req.body.especialidad,
        doctor: req.body.doctor,
        fechaMes: req.body.fechaMes,
        fechaDia: req.body.fechaDia,
        fechaYear: req.body.fechaYear,
        hora: req.body.hora,
        descripcion: req.body.descripcion        
    };
    console.log(variablesRechazar);

    await adminService.EmailRechazar(variablesRechazar);

    console.log("nojodaaa")
    connection.query('DELETE FROM citas WHERE idcitas = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.redirect('/Solicitudes');
    });

};

module.exports = {
    getAdmin: getAdmin,
    medicina: medicina,
    odontologia: odontologia,
    AgendaMed: AgendaMed,    
    AgendaOdont: AgendaOdont,
    Solicitudes: Solicitudes,
    SolicitudesIndivial:SolicitudesIndivial,
    Rechazar: Rechazar
}