import connection from "../configs/connectDB";
import adminService from "../services/adminService";
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
    let horarioMed = {   
        especialidad: especialidad,
        Medico: req.body.Medico,
        Dia: req.body.Dia,
        horaInicio: req.body.H1,
        horaFin: req.body.H2,  
    };
    console.log(horarioMed)
    await adminService.crearAgendaMed(horarioMed);
    res.redirect("/admin/admin");
}

let AgendaOdont = async (req, res) => {

    var especialidad = "Odontología";    
    let horarioOdont = {   
        especialidad: especialidad,
        Medico: req.body.Odontologo,
        Dia: req.body.Dia1,
        horaInicio: req.body.H3,
        horaFin: req.body.H4,  
    };
    console.log(horarioOdont)
    await adminService.crearAgendaOdont(horarioOdont);
    res.redirect("/admin/admin");
}

// let AgregarHorariosOdont = async(req, res) => {

//     var especialidad = "Odontología";
//     var Medico = req.body.Odontologo;
//     var Dia = req.body.Dia1;
//     var HoraInicio = req.body.H3;
//     var HoraFin = req.body.H4;

//     connection.query(`INSERT INTO horarios (Doctor, Especialidad, Dia, Hora_Inicio, Hora_Fin) 
//     VALUES ("${especialidad}", "${Medico}", "${Dia}", "${HoraInicio}", "${HoraFin}")`, (err, data) => {
//         if (err) {
//             res.json(err);
//         }
//         var result = data
//         res.end(JSON.stringify(result));  
//         console.log(data)     
//     });
// }

module.exports = {
    getAdmin: getAdmin,
    medicina: medicina,
    odontologia: odontologia,
    AgendaMed: AgendaMed,
    // AgregarHorariosMed: AgregarHorariosMed,
    AgendaOdont: AgendaOdont
}