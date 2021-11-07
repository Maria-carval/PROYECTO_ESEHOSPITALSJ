import connection from "../configs/connectDB";
import bcrypt from "bcryptjs";


let BuscarEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "SELECT * FROM usuario WHERE Correo = ? ", email,
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

let BuscarId = (id) => {
    return new Promise((resolve, reject) =>{
        try {
            connection.query("SELECT * FROM usuario WHERE idusuario = ?", id, function(err, data){
                if (err) {
                    reject(err)
                }
                let usuario = data[0];
                resolve(usuario);
            });
        } catch (e) {
            reject(e);
        }
    });
};

let compararContraseñas = (password, usuario) => {
    return new Promise(async (resolve, reject) => {
        try {            
            await bcrypt.compare(password, usuario.Password).then((isMatch) => {
                if (isMatch) {
                    console.log('SIUUUUUU')
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
};

module.exports = {    
    BuscarEmail: BuscarEmail,
    BuscarId: BuscarId,
    compararContraseñas: compararContraseñas
}