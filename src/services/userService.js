import connection from "../configs/connectDB";

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

let Solicitar = (Nombre, Apellido, Correo, Celular, Tipo, Cedula, Factura, Regimen,
    Entidad, Especialidad, Doctor, newdate, Hora, Orden, Descripcion, IdU, Estado) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                `INSERT INTO citas (Nombres, Apellidos, Correo, Celular, Tipo_Documento, 
                Numero_Documento, Afiliacion, Regimen, Entidad, Especialidad, Doctor, Fecha, Hora, 
                Orden, Descripcion, Estado_cita, idusuario) 
                VALUES ("${Nombre}", "${Apellido}", "${Correo}", "${Celular}", "${Tipo}", "${Cedula}", 
                "${Factura}", "${Regimen}", "${Entidad}", "${Especialidad}", "${Doctor}", "${newdate}", 
                "${Hora}", "${Orden}", "${Descripcion}", "${Estado}", "${IdU}")`,
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

module.exports = {
    RevisarHorarios: RevisarHorarios,
    consultarCitasDisponibles: consultarCitasDisponibles,
    ConsultarDisponibilidad: ConsultarDisponibilidad,
    Solicitar: Solicitar
}