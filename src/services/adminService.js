import connection from "../configs/connectDB";

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
            hora_Fin: horarioMed.horaFin       
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
        await AgregarHorariosMedInterval(horarioMed.Dia, horarioMed.Medico, horarioMed.especialidad, TimeSlot, IdHorarioMed);
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

let AgregarHorariosMedInterval = (Dia, Medico, especialidad, horaInicio, IdHorario) => {
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

module.exports = {
    crearAgendaMed: crearAgendaMed,
    crearAgendaOdont: crearAgendaOdont,
    addMinutes: addMinutes    
}