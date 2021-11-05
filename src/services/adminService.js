import connection from "../configs/connectDB";
import gmailController from "../controllers/gmailController";

// AGENDA MEDICINA GENERAL //
let crearAgendaMed = async (horarioMed) => {
    var Intervalo = "15";
    //console.log(horarioMed);
    if (horarioMed.horaInicio !== '' && horarioMed.horaFin !== '') {
        var variablesHorario = {
            Doctor: horarioMed.Medico,
            Especialidad: horarioMed.especialidad,
            Dia: horarioMed.Dia,
            hora_Inicio: horarioMed.horaInicio,
            hora_Fin: horarioMed.horaFin,
            IdDia: horarioMed.IdDia
        }
        var IdHorarioMed = await AgregarHorariosMed(variablesHorario);

        var StartT = horarioMed.horaInicio;
        var EndT = horarioMed.horaFin;
        var TimeSlot = [StartT];

        while (StartT != EndT) {
            StartT = addMinutes(StartT, Intervalo);
            TimeSlot.push(StartT);
        }
        TimeSlot.pop();
        console.log(TimeSlot);
        await AgregarHorariosMedInterval(horarioMed.Dia, horarioMed.Medico, horarioMed.especialidad, TimeSlot, IdHorarioMed, horarioMed.IdDia);
        console.log(TimeSlot);
    }
}

let AgregarHorariosMed = (variablesHorario) => {

    console.log(variablesHorario);
    return new Promise(async (resolve, reject) => {
        try {
            console.log(variablesHorario);
            connection.query(
                ' INSERT INTO horarios set ? ', variablesHorario,
                function (err, data) {
                    if (err) {
                        reject(false)
                    }
                    resolve(data.insertId);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

let AgregarHorariosMedInterval = (Dia, Medico, especialidad, horaInicio, IdHorario, IdDia) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(horaInicio);

            horaInicio.forEach(element => {
                connection.query(
                    `INSERT INTO horario_intervalo (Dia, Doctor, Especialidad, Hora_Inicio, Id_Horario, Id_Dia) 
                    VALUES ("${Dia}", "${Medico}", "${especialidad}", "${element}", "${IdHorario}", "${IdDia}")`,
                    function (err, data) {
                        if (err) {
                            reject(false)
                        }
                        resolve("Adición exitosa");
                    }
                );
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

// AGENDA ODONTOLOGÍA //
let crearAgendaOdont = async (horarioOdont) => {
    var Intervalo = "15";
    //console.log(horarioOdont);
    if (horarioOdont.horaInicio !== '' && horarioOdont.horaFin !== '') {
        var variablesHorario1 = {
            Doctor: horarioOdont.Medico,
            Especialidad: horarioOdont.especialidad,
            Dia: horarioOdont.Dia,
            hora_Inicio: horarioOdont.horaInicio,
            hora_Fin: horarioOdont.horaFin
        }
        var IdHorarioOdont = await AgregarHorariosOdont(variablesHorario1);

        var StartT = horarioOdont.horaInicio;
        var EndT = horarioOdont.horaFin;
        var TimeSlot = [StartT];

        while (StartT != EndT) {
            StartT = addMinutes(StartT, Intervalo);
            TimeSlot.push(StartT);
        }
        TimeSlot.pop();
        console.log(TimeSlot);
        await AgregarHorariosOdontInterval(horarioOdont.Dia, horarioOdont.Medico, horarioOdont.especialidad, TimeSlot, IdHorarioOdont);
        console.log(TimeSlot);
    }
}

let AgregarHorariosOdont = (variablesHorario1) => {

    console.log(variablesHorario1);
    return new Promise(async (resolve, reject) => {
        try {
            console.log(variablesHorario1);
            connection.query(
                ' INSERT INTO horarios set ? ', variablesHorario1,
                function (err, data) {
                    if (err) {
                        reject(false)
                    }
                    resolve(data.insertId);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

let AgregarHorariosOdontInterval = (Dia, Medico, especialidad, horaInicio, IdHorario) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(horaInicio);

            horaInicio.forEach(element => {
                connection.query(
                    `INSERT INTO horario_intervalo (Dia, Doctor, Especialidad, Hora_Inicio, Id_Horario) 
                    VALUES ("${Dia}", "${Medico}", "${especialidad}", "${element}", "${IdHorario}")`,
                    function (err, data) {
                        if (err) {
                            reject(false)
                        }
                        resolve("Adición exitosa");
                    }
                );
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

// PARA HACER LA DIVICIÓN DEL TIEMPO //
function addMinutes(time, minutes) {
    var date = new Date(new Date('01/01/2015 ' + time).getTime() + minutes * 60000);
    var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
        ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
        ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    return tempTime;
}

let EmailRechazar = async (variablesRechazar) => {

    var body;
    console.log(variablesRechazar.correo);
    console.log(variablesRechazar.descripcion);
    if (!variablesRechazar.descripcion) {
        body = `<h4>Estimado/a <em> ${variablesRechazar.nombre} ${variablesRechazar.apellido}.</em></h4>
        <div class="text-center mb-2">
    Se le informa que su solicitud de cita médica para ${variablesRechazar.especialidad} con el/la doctor(a) ${variablesRechazar.doctor} para el día ${variablesRechazar.fechaDia} de ${variablesRechazar.fechaMes} del año ${variablesRechazar.fechaYear} a las ${variablesRechazar.hora} ha sido rechazada.
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 6868098
      </a>
      <p><small><em>Por favor no responder este correo.</em></small></p>
      </div>`
    } else {
       body = `<h4>Estimado/a <em> ${variablesRechazar.nombre} ${variablesRechazar.apellido}.</em></h4>
    <div class="text-center mb-2">
    Se le informa que su solicitud de cita médica para ${variablesRechazar.especialidad} con el/la doctor(a) ${variablesRechazar.doctor} para el día ${variablesRechazar.fechaDia} de ${variablesRechazar.fechaMes} del año ${variablesRechazar.fechaYear} a las ${variablesRechazar.hora} ha sido rechazada.
    </div>
    <div class="text-center mb-2">
    
    <strong>
    ${variablesRechazar.descripcion}
    </strong>
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 6868098
      </a>    
      <p><small><em>Por favor no responder este correo.</em></small></p>  
      </div>`
    }
    gmailController.sendEmail(variablesRechazar.correo, 'IMPORTANTE: Solicitud de cita médica - ESE HOSPITAL SAN JACINTO', body)
};

module.exports = {
    crearAgendaMed: crearAgendaMed,
    crearAgendaOdont: crearAgendaOdont,
    addMinutes: addMinutes,
    EmailRechazar: EmailRechazar
}