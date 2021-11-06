import connection from "../configs/connectDB";
import gmailController from "../controllers/gmailController";

let RevisarHorarios = (Dia, Doctor, Especialidad) => {
    const DiaSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const numDia = [1, 2, 3, 4, 5, 6]

    try {
        var j = numDia.indexOf(Dia);
        var DayOfWeek = DiaSemana[j];        
        return new Promise((resolve, reject) => {
            try {
                connection.query(
                    `SELECT Hora_Inicio from horario_intervalo WHERE Dia = "${DayOfWeek}" AND Doctor = "${Doctor}"
                    AND Especialidad = "${Especialidad}"`,
                    function (err, data) {
                        if (err) {
                            reject(err)
                        }
                        resolve(data);
                    }
                );
            } catch (err) {
                reject(err);
            }
        });
    } catch (error) {
        reject(error);
    }
};

let consultarCitasDisponibles = (Fecha, Especialidad, Doctor) => {
    return new Promise((resolve, reject) => {
        try {
          
            var FormatDate = convert(Fecha);
     
            connection.query(
                `SELECT Hora from citas WHERE fecha = "${FormatDate}"  AND Especialidad = "${Especialidad}"
                AND Doctor = "${Doctor}"`,
                function (err, data) {
                    if (err) {
                        reject(err)
                    }
                    resolve(data);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let RevisarHorariosLab = (Dia, Examen) => {
    const DiaSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const numDia = [1, 2, 3, 4, 5, 6]

    try {
        var j = numDia.indexOf(Dia);
        var DayOfWeek = DiaSemana[j];        
        return new Promise((resolve, reject) => {
            try {
                connection.query(
                    `SELECT Hora_Inicio from horariolab_intervalo WHERE Dia = "${DayOfWeek}" AND Examen = "${Examen}"`,
                    function (err, data) {
                        if (err) {
                            reject(err)
                        }
                        resolve(data);
                    }
                );
            } catch (err) {
                reject(err);
            }
        });
    } catch (error) {
        reject(error);
    }
};

let consultarCitasDisponiblesLab = (Fecha, Examen) => {
    return new Promise((resolve, reject) => {
        try {
          
            var FormatDate = convert(Fecha);
     
            connection.query(
                `SELECT Hora from citas WHERE fecha = "${FormatDate}"  AND Examen = "${Examen}"`,
                function (err, data) {
                    if (err) {
                        reject(err)
                    }
                    resolve(data);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let ConsultarDisponibilidad = (Especialidad, Doctor, newdate, Hora) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM citas WHERE Especialidad = "${Especialidad}" 
                AND Doctor = "${Doctor}" AND Fecha = "${newdate}"
                AND Hora = "${Hora}"`, (err, data) => {
                if (err) {
                    res.json(err);
                }
                if (!data.length) {
                    resolve(true);
                } else {
                    console.log('No disponible');
                    resolve(false);
                }
            });

        } catch (err) {
            reject(err);
        }
    });
};

let ConsultarDisponibilidadLab = (Examen, newdate, Hora) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM citas WHERE Examen = "${Examen}" AND Fecha = "${newdate}"
                AND Hora = "${Hora}"`, (err, data) => {
                if (err) {
                    res.json(err);
                }
                if (!data.length) {
                    resolve(true);
                } else {
                    console.log('No disponible');
                    resolve(false);
                }
            });

        } catch (err) {
            reject(err);
        }
    });
};

let Solicitar = (Nombre, Apellido, Correo, Celular, Tipo, Cedula, Factura, Regimen,
    Entidad, TipoCita, Especialidad, Doctor, Examen, newdate, Hora, Orden, Descripcion, IdU, Estado) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                `INSERT INTO citas (Nombres, Apellidos, Correo, Celular, Tipo_Documento, 
                Numero_Documento, Afiliacion, Regimen, Entidad, Solicitud, Especialidad, Doctor, Examen,
                Fecha, Hora, Orden, Descripcion, Estado_cita, idusuario) 
                VALUES ("${Nombre}", "${Apellido}", "${Correo}", "${Celular}", "${Tipo}", "${Cedula}", 
                "${Factura}", "${Regimen}", "${Entidad}", "${TipoCita}", "${Especialidad}", "${Doctor}", "${Examen}", 
                "${newdate}", "${Hora}", "${Orden}", "${Descripcion}", "${Estado}", "${IdU}")`,
                function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);                   
                }       
            );

        } catch (err) {
            reject(err);
        }
    });
};

function convert(date){
    var datearray = date.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
    return newdate;
}

let EmailEliminar = async (variablesEliminar) => {

    var body;
    console.log(variablesEliminar.correo);  
    if(variablesEliminar.tipocita == 'Cita médica'){
        body = `<h4>Estimado E.S.E Hospital San Jacinto</h4>
    <div class="text-center mb-2">
    Se le informa que el usuario <em>${variablesEliminar.nombre} ${variablesEliminar.apellido}</em> ha <strong>cancelado su cita médica</strong>, la cual se encontraba programada con el/la doctor(a) ${variablesEliminar.doctor} en la especialidad de ${variablesEliminar.especialidad} para el día ${variablesEliminar.fechaDia} de ${variablesEliminar.fechaMes} del año ${variablesEliminar.fechaYear} a las ${variablesEliminar.hora}.
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">     
      <p><small><em>Por favor no responder este correo.</em></small></p>
      </div>`
    } else if(variablesEliminar.tipocita == 'Examen de laboratorio') {
        body = `<h4>Estimado E.S.E Hospital San Jacinto</h4>
    <div class="text-center mb-2">
    Se le informa que el usuario <em>${variablesEliminar.nombre} ${variablesEliminar.apellido}</em> ha <strong>cancelado su ${variablesEliminar.examen}</strong>, el cual se encontraba programado para el día ${variablesEliminar.fechaDia} de ${variablesEliminar.fechaMes} del año ${variablesEliminar.fechaYear} a las ${variablesEliminar.hora}.
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">     
      <p><small><em>Por favor no responder este correo.</em></small></p>
      </div>`
    }   
    
    gmailController.sendEmail('citassanjacintobolivar@gmail.com', 'IMPORTANTE: Cancelación de cita médica - ESE HOSPITAL SAN JACINTO', body)
};

module.exports = {
    RevisarHorarios: RevisarHorarios,
    consultarCitasDisponibles: consultarCitasDisponibles,
    RevisarHorariosLab: RevisarHorariosLab,
    consultarCitasDisponiblesLab: consultarCitasDisponiblesLab,
    ConsultarDisponibilidad: ConsultarDisponibilidad,
    ConsultarDisponibilidadLab: ConsultarDisponibilidadLab,
    Solicitar: Solicitar,
    EmailEliminar: EmailEliminar
}