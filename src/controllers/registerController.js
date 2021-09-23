import connection from "../configs/connectDB";
import {validationResult} from "express-validator";
import registerService from "../services/registerService";

let ObtenerPaginaRegistro = (req, res) => {
    return res.render("register.ejs", {
        errors: req.flash("errors")
    });
};

let CrearUsuario = async (req, res) => {
     
    try{
        let nuevoUsuario = {
            Nombre: req.body.name,
            Apellido: req.body.lastname,            
            Correo: req.body.email,            
            Celular: req.body.phone,    
            Password: req.body.password
        };
        console.log(nuevoUsuario)
        await registerService.CrearUsuario(nuevoUsuario);
        return res.redirect("/Inicio");

    }catch(e){
        req.flash("errors", e);
        return res.redirect("/registro");

    }
};

// router.post("/registro", (req, res) => {
//     var data = req.body;
//     console.log(data)
//     var Nombre = req.body.name;
//     var Apellido = req.body.lastname;
//     var Correo = req.body.email;
//     var Celular = req.body.phone;
//     var Contraseña = req.body.password;
//     // var Nombre = "María Laura";
//     // var Apellido = "Carval Vásquez";
//     // var Correo = "xd@gmail.com";
//     // var Celular = "3022741742";
//     // var Contraseña = "123";
//     var Role = "user";
//     console.log(Nombre)

//     connection.query(
//         `INSERT INTO usuario (Nombres, Apellidos, Correo, Celular, Contraseña, Role)
//          VALUES ("${Nombre}", "${Apellido}", "${Correo}", "${Celular}", "${Contraseña}", "${Role}")`,
//         function (err, rows) {
//             if (err) {
//                 res.json(err);
//             }       
//             //res.redirect("register.ejs")
//         }
//     );
// });

module.exports = {
    ObtenerPaginaRegistro: ObtenerPaginaRegistro,
    CrearUsuario: CrearUsuario
}