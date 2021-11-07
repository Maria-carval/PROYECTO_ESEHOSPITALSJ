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

let OpcionesLab = (req, res) => {
    connection.query('SELECT Examen FROM laboratorios', (err, data) => {
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

let OpcionesHorarioLab = async (req, res) => {

    var Fecha = req.body.date;
    console.log(Fecha);

    var Examen = req.body.Laboratorio;
    console.log(Examen);

    var date = new Date(Fecha);
    //A ESA FECHA SE LE OBTIENE EL DÍA PARA COMPARARLO CON EL QUE ESTÁ EN LA BASE DE DATOS
    var Dia = date.getDay();

    var i = 0;

    //TRAER LOS HORARIOS DE LOS MÉDICOS SEGÚN EL TIPO DE EXAMEN
    let Horarios = await userService.RevisarHorariosLab(Dia, Examen);
    i = 0;
    var Vector_HI = [];

    //AGREGAR LOS HORARIOS EN EL VECTOR 
    Object.keys(Horarios).forEach(function (key) {
        Vector_HI[i] = Horarios[key].Hora_Inicio;
        i++;
    });

    console.log(Vector_HI);

    //TRAER LAS CITAS QUE HAN SIDO AGENDADAS O ESTÁN PENDIENTE DE APROBACIÓN
    let citas = await userService.consultarCitasDisponiblesLab(Fecha, Examen);
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

let TablaHorarioLab = (req, res) => {
    connection.query('SELECT Examen, Dia, HoraInicio, HoraFin FROM horarioslab', (err, data) => {
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
    var Regimen, Entidad;
    if (Factura == "EPS") {
        Regimen = req.body.regimen;
        Entidad = req.body.entidad
    } else {
        Regimen = 'No aplica';
        Entidad = 'No aplica';
    }

    var TipoCita = req.body.TipoCita;
    var Especialidad, Doctor, Examen;
    if (TipoCita == "Cita médica") {
        Especialidad = req.body.opciones;
        Doctor = req.body.Doctores;
        Examen = 'No aplica';
    } else if (TipoCita == "Examen de laboratorio") {
        Especialidad = 'No aplica';
        Doctor = 'No aplica';
        Examen = req.body.Laboratorio;
    }

    var Fecha = req.body.fecha;
    var Hora = req.body.Horario;
    var Orden = req.body.orden;
    var Descripcion;
    if (!Descripcion) {
        Descripcion = 'No aplica';
    } else {
        Descripcion = req.body.descripcion;
    }

    var user = req.session.context;
    var IdU = user.idusuario;

    var Estado = 'Pendiente';

    var datearray = Fecha.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];

    console.log(datos);
    console.log(Hora)

    let CitasDispo;
    if (TipoCita == "Cita médica") {
        CitasDispo = await userService.ConsultarDisponibilidad(Especialidad, Doctor, newdate, Hora);
    } else if (TipoCita == "Examen de laboratorio") {
        CitasDispo = await userService.ConsultarDisponibilidadLab(Examen, newdate, Hora);
    }

    if (CitasDispo) {
        await userService.Solicitar(Nombre, Apellido, Correo, Celular, Tipo, Cedula, Factura, Regimen,
            Entidad, TipoCita, Especialidad, Doctor, Examen, newdate, Hora, Orden, Descripcion, IdU, Estado);

        res.redirect('/usuario/usuario')
    } else {
        return res.redirect('/usuario/usuario')
    }
}

let SolicitudUser = (req, res) => {
    if (req.session.user) {
        var user = req.session.context;
        var id = user.idusuario;
        console.log('whyyyyy')
        connection.query(`SELECT idcitas, Nombres, Apellidos, Correo, Celular, Tipo_Documento, Numero_Documento,
        Afiliacion, Regimen, Entidad, Solicitud, Especialidad, Doctor, Examen, DATE_FORMAT(Fecha, "%Y-%m-%d") Fecha, 
        Hora, DATE_FORMAT(Hora, "%I:%i:%p") Hora12, Orden, Descripcion, Estado_cita FROM citas WHERE idusuario = ?`, [id], (err, data) => {
            if (err) {
                res.json(err);
            }
            console.log(data);
            res.render('./usuario/usuarioSolicitud.ejs', {
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

let DatosUserA = (req, res) => {
    //const id = req.params.idcitas;
    var id = req.body.idC;
    if (req.session.user) {
        connection.query(`SELECT idcitas, Nombres, Apellidos, Correo, Celular, Tipo_Documento, 
        Numero_Documento, Afiliacion, Regimen, Entidad, Solicitud, Especialidad, Doctor, Examen, Estado_cita,
        DATE_FORMAT(Fecha, "%Y-%m-%d") Fecha, MONTHNAME(Fecha) Mes, DAY(Fecha) Dia, YEAR(Fecha) Año, 
        Hora, DATE_FORMAT(Hora, "%I:%i : %p") Hora12, Orden, Descripcion FROM citas WHERE idcitas = ?`, [id], (err, datos) => {
            if (err) {
                res.json(err);
            }
            console.log(datos);
            var datos = datos
            res.end(JSON.stringify(datos));
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};


let Actualizar = async (req, res) => {
    var user = req.session.context;

    if (req.session.user) {
        var id = req.body.id;
        var Nombre = req.body.Name;
        var Apellido = req.body.Lastname;
        var Correo = req.body.email;
        var Celular = req.body.number;
        var Pregunta = req.body.ask;
        var Cedula = req.body.Cedula;
        var Orden = req.body.orden;
        var PreguntaSolicitud = req.body.asktipo;
        var Fecha = req.body.fecha;
        var datearray = Fecha.split("-");
        var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
        var Hora = req.body.Horario;

        if (PreguntaSolicitud == '1') {
            if (Pregunta == '1') {
                connection.query(`UPDATE citas SET Nombres = ?, Apellidos = ?, Correo = ?,
                Celular = ?, Numero_Documento = ?, Orden = ? WHERE idcitas = ?`, [Nombre, Apellido, Correo,
                    Celular, Cedula, Orden, id], (err, datos) => {
                        if (err) {
                            res.json(err);
                        }
                        console.log(datos);
                        res.redirect('/ConsultarUser');
                    });
            } else if (Pregunta == '2') {
                var Tipo = req.body.Tipo;
                console.log(Tipo);

                connection.query(`UPDATE citas SET Nombres = ?, Apellidos = ?, Correo = ?,
                Celular = ?, Tipo_Documento = ?, Numero_Documento = ?, Orden = ? WHERE idcitas = ?`, [Nombre,
                    Apellido, Correo, Celular, Tipo, Cedula, Orden, id], (err, datos) => {
                        if (err) {
                            res.json(err);
                        }
                        console.log(datos);
                        res.redirect('/ConsultarUser');
                    });
            } else {
                console.log('No hacer ninguna acción')
            }
        } else if (PreguntaSolicitud == '2') {
            var Factura = req.body.Factura;
            var Regimen, Entidad;
            if (Factura == "EPS") {
                Regimen = req.body.regimen;
                Entidad = req.body.entidad
            } else {
                Regimen = 'No aplica';
                Entidad = 'No aplica';
            }
            var Solicitud = req.body.TipoCita;
            var Especialidad, Doctor, Examen;
            if (Solicitud == 'Cita médica') {
                Especialidad = req.body.opciones;
                Doctor = req.body.Doctores;
                Examen = 'No aplica'
            } else if (Solicitud == 'Examen de laboratorio') {
                Especialidad = 'No aplica';
                Doctor = 'No aplica';
                Examen = req.body.Laboratorio;
            } else {
                console.log('punto')
            }

            if (Pregunta == '1') {

                connection.query(`UPDATE citas SET Nombres = ?, Apellidos = ?, Correo = ?,
                Celular = ?, Numero_Documento = ?, Afiliacion = ?, Regimen = ?, Entidad = ?, Orden = ?, Solicitud = ?, Especialidad = ?,
                Doctor = ?, Examen = ?, Fecha = ?, Hora = ? WHERE idcitas = ?`, [Nombre, Apellido, Correo,
                    Celular, Cedula, Factura, Regimen, Entidad, Orden, Solicitud, Especialidad, Doctor,
                    Examen, newdate, Hora, id], (err, datos) => {
                        if (err) {
                            res.json(err);
                        }
                        console.log(datos);
                        res.redirect('/ConsultarUser');
                    });

            } else if (Pregunta == '2') {
                
                var Tipo = req.body.Tipo;

                connection.query(`UPDATE citas SET Nombres = ?, Apellidos = ?, Correo = ?,
                Celular = ?, Tipo_Documento = ?, Numero_Documento = ?, Afiliacion = ?, Regimen = ?, 
                Entidad = ?, Orden = ?, Solicitud = ?, Especialidad = ?, Doctor = ?, Examen = ?,
                Fecha = ?, Hora = ? WHERE idcitas = ?`, [Nombre, Apellido, Correo, Celular, Tipo, 
                Cedula, Factura, Regimen, Entidad, Orden, Solicitud, Especialidad, Doctor, Examen, 
                newdate, Hora, id], (err, datos) => {
                        if (err) {
                            res.json(err);
                        }
                        console.log(datos);
                        res.redirect('/ConsultarUser');
                    });
            } else {
                console.log('error')
            }
        }


    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};

let DatosUser = (req, res) => {
    //const id = req.params.idcitas;
    var id = req.body.idC;
    if (req.session.user) {
        connection.query(`SELECT idcitas, Nombres, Apellidos, Correo, Celular, Tipo_Documento, 
        Numero_Documento, Afiliacion, Regimen, Entidad, Solicitud, Especialidad, Doctor, Examen, Estado_cita,
        DATE_FORMAT(Fecha, "%Y-%m-%d") Fecha, MONTHNAME(Fecha) Mes, DAY(Fecha) Dia, YEAR(Fecha) Año, 
        Hora, DATE_FORMAT(Hora, "%I:%i : %p") Hora12, Orden, Descripcion FROM citas WHERE idcitas = ?`, [id], (err, datos) => {
            if (err) {
                res.json(err);
            }
            console.log(datos);
            var datos = datos
            res.end(JSON.stringify(datos));
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};

let Eliminar = async (req, res) => {

    const datos = req.body;
    const id = req.body.id;

    console.log(datos)

    let variablesEliminar = {
        correo: req.body.correo,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        tipocita: req.body.tipocita,
        especialidad: req.body.especialidad,
        doctor: req.body.doctor,
        examen: req.body.examen,
        fechaMes: req.body.fechaMes,
        fechaDia: req.body.fechaDia,
        fechaYear: req.body.fechaYear,
        hora: req.body.hora
    };
    console.log(variablesEliminar);

    var estado = req.body.estado;
    if (estado == "Aceptada") {
        await userService.EmailEliminar(variablesEliminar);
    } else {
        console.log('No envía correo')
    }

    console.log("dios")
    connection.query('DELETE FROM citas WHERE idcitas = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.redirect('/ConsultarUser');
    });

};

module.exports = {
    getUser: getUser,
    OpcionesEspe: OpcionesEspe,
    OpcionesDr: OpcionesDr,
    OpcionesLab: OpcionesLab,
    OpcionesEPS: OpcionesEPS,
    OpcionesHorario: OpcionesHorario,
    OpcionesHorarioLab: OpcionesHorarioLab,
    TablaHorario: TablaHorario,
    TablaHorarioLab: TablaHorarioLab,
    SolicitarCita: SolicitarCita,
    SolicitudUser: SolicitudUser,
    DatosUserA: DatosUserA,
    Actualizar: Actualizar,
    DatosUser: DatosUser,
    Eliminar: Eliminar
}