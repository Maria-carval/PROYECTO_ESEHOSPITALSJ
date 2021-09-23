import connection from "../configs/connectDB";
import bcrypt from "bcryptjs";

let CrearUsuario = (usuario) => {
    return new Promise(async (resolve, reject) =>{
        try {
            //VALIDAR SI EL CORREO YA SE ENCUENTRA REGISTRADO EN LA DB
            let check = await validarCorreo(usuario.Correo);
            if (check) {
                console.log(usuario);
                reject(`"${usuario.Correo}" ya existe, por favor ingrese otro correo.`)
            } else {
                //ENCRIPTAR LA CONTRASEÑA CON BCRYPT
                let hashPassword = await bcrypt.hash(usuario.Password,10);
                console.log(hashPassword)
                let userItem = {
                    Nombres: usuario.Nombre,
                    Apellidos: usuario.Apellido,
                    Correo: usuario.Correo,
                    Celular: usuario.Celular,   
                    Password: hashPassword,                      
                    Role: 'user'                                              
                };
                console.log('HELP ME PLEASE');
                console.log(userItem);
                //GUARDAR EN LA DB EL USUARIO CREADO
                connection.query(
                    ' INSERT INTO usuario set ? ', userItem,
                    function(err, data) {
                        if (err) {
                            reject(`No se pudo crear el usuario`)
                        }
                        resolve("Se creó correctamente el usuario");
                    }
                );
            }           
        } catch (e) {
            reject(e);
        }
    });
};

let validarCorreo = (Correo) => {
    return new Promise( (resolve, reject) => {
        try {
            connection.query( "SELECT * from usuario where Correo = ?", Correo,
                function(err, data) {
                    if (err) {
                        reject(err)
                    }
                    if (data.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    CrearUsuario: CrearUsuario,
    validarCorreo: validarCorreo
};