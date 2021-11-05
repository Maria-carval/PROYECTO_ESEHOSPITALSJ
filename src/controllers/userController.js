import connection from "../configs/connectDB";
import userService from "../services/userService";
import jwt from "jsonwebtoken";

//FUNCIÓN PARA LA PÁGINA PRINCIPAL DEL MÓDULO USUARIO
let getUser = (req, res) => {
    if (req.session.user) {
        return res.render("./usuario/usuario.ejs", {
            user: req.session.context
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
}

let OpcionesEspe = (req, res) => {
    connection.query('SELECT Especialidad FROM especialidad', (err, data) => {
        if (err) {
            res.json(err);
        }
        var datos = data
        res.end(JSON.stringify(datos));        
    });
};

let OpcionesDr = (req, res) => {
    connection.query('SELECT Doctor, Especialidad FROM medicos', (err, data) => {
        if (err) {
            res.json(err);
        }
        var datos = data
        res.end(JSON.stringify(datos));        
    });
};

let OpcionesEPS = (req, res) => {
    connection.query('SELECT EPS FROM eps', (err, data) => {
        if (err) {
            res.json(err);
        }
        var datos = data
        res.end(JSON.stringify(datos));        
    });
};


let OpcionesHorario = async (req, res) => {

    var Fecha = req.body.date;
    console.log(Fecha);

    var Doctor = req.body.Doctor;
    console.log(Doctor);
    var Especialidad = req.body.Especialidad;
    console.log(Especialidad);
    var date = new Date(Fecha); 
    //A ESA FECHA SE LE OBTIENE EL DÍA PARA COMPARARLO CON EL QUE ESTÁ EN LA BASE DE DATOS
    var Dia = date.getDay();
  
    var i = 0;
    
    //TRAER LOS HORARIOS DE LOS MÉDICOS SEGÚN SU ESPECIALIDAD
    let Horarios = await userService.RevisarHorarios(Dia, Doctor, Especialidad);
    i = 0;
    var Vector_HI = [];    

    //AGREGAR LOS HORARIOS EN EL VECTOR 
    Object.keys(Horarios).forEach(function (key) {
        Vector_HI[i] = Horarios[key].Hora_Inicio;         
        i++;
    });
    
    console.log(Vector_HI);

    //TRAER LAS CITAS QUE HAN SIDO AGENDADAS O ESTÁN PENDIENTE DE APROBACIÓN
    let citas = await userService.consultarCitasDisponibles(Fecha, Especialidad, Doctor);
    i = 0;
    var Vector_Cita = [];
    
    Object.keys(citas).forEach(function (key) {
        Vector_Cita[i] = citas[key].Hora;
        i++;
    });  
    console.log(Vector_Cita);

    //UTILIZAR FILTER SOLO PARA SELECCIONAR LOS HORARIOS DISPONIBLES
    Vector_HI = Vector_HI.filter(function (element) {
        return !Vector_Cita.includes(element);
    });   
      
    var hora = Vector_HI;
    res.end(JSON.stringify(hora));
    console.log(hora)    
}

// let AgendaHorario = (req, res) => {
//     connection.query('SELECT Especialidad, Doctor, Hora_Inicio, Id_Dia, Dia FROM horario_intervalo WHERE Doctor = "Eulalia Valencia"', (err, data) => {
//         if (err) {
//             res.json(err);
//         }
//         var datos = data
//         res.end(JSON.stringify(datos));        
//     });
// };


let TablaHorario = (req, res) => {
    connection.query('SELECT Doctor, Dia, Hora_Inicio, Hora_Fin FROM horarios', (err, data) => {
        if (err) {
            res.json(err);
        }
        console.log(data)
        var data = data
        res.end(JSON.stringify(data));        
    });
};


let SolicitarCita = async (req, res) => {
    const datos = req.body;
    var Nombre = req.body.Name;
    var Apellido = req.body.Lastname; 
    var Correo = req.body.email; 
    var Celular = req.body.number;  
    var Tipo = req.body.Tipo;
    var Cedula = req.body.Cedula;

    var Factura = req.body.Factura;
    var Regimen,Entidad;
    if (Factura == "EPS") {
        Regimen = req.body.regimen;
        Entidad = req.body.entidad
    } else {
        Regimen = 'No aplica';
        Entidad = 'No aplica';
    }
    var Especialidad = req.body.opciones;
    var Doctor = req.body.Doctores;
        
    var Fecha = req.body.fecha;
    var Hora = req.body.Horario;  
    var Orden = req.body.orden;
    var Descripcion = req.body.descripcion;
    var user = req.session.context;
    var IdU = user.idusuario;     
 
    var Estado = 'Pendiente';   
   
    var datearray = Fecha.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];

    console.log(datos);
    console.log(Hora)

    let CitasDispo = await userService.ConsultarDisponibilidad(Especialidad, Doctor, newdate, Hora);

    if (CitasDispo) {
        let Agendamiento = await userService.Solicitar(Nombre, Apellido, Correo, Celular, Tipo, Cedula, Factura, Regimen,
            Entidad, Especialidad, Doctor, newdate, Hora, Orden, Descripcion, IdU, Estado);

        res.redirect('/usuario/usuario')
    } else {
        return res.redirect('/usuario/usuario')
    }
}

module.exports = {
    getUser: getUser,  
    OpcionesEspe: OpcionesEspe,
    OpcionesDr: OpcionesDr,  
    OpcionesEPS: OpcionesEPS,
    OpcionesHorario: OpcionesHorario,  
    TablaHorario: TablaHorario,     
    SolicitarCita: SolicitarCita    
}