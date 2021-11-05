import connection from "../configs/connectDB";
import bcrypt from "bcryptjs";


let BuscarEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "SELECT * from usuario where Correo = ? ", email,
                function(err, data) {
                    if (err) {
                        reject(err)
                    }
                    let usuario = data[0];
                    resolve(usuario);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let compararContraseñas = (password, usuario) => {

    return new Promise(async (resolve, reject) => {
        try {            
            await bcrypt.compare(password, usuario.Password).then((isMatch) => {
                if (isMatch) {
                    console.log('SIUUUUUUUUUU')
                    resolve(true);
                } else {
                    console.log('OMBECOMOVASER')
                    resolve(false);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
    
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         await bcrypt.compare(password, user.password).then((isMatch) => {
    //             if (isMatch) {
    //                 console.log('hola si, sonido')
    //                 resolve(true);
    //             } else {
    //                 console.log('q ise')
    //                 resolve(false);
    //             }
    //         });
    //     } catch (e) {
    //         reject(e);
    //     }
    // });
};

module.exports = {
    compararContraseñas: compararContraseñas,
    BuscarEmail: BuscarEmail,
    // findUserById: findUserById
}