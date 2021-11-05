import loginService from "../services/loginService";
import connection from "../configs/connectDB";
const flash = require('connect-flash');



//RUTA PARA LA PÁGINA DE PRINCIPAL DEL MÓDULO ADMINISTRATIVO
// let HomePage = (req, res) => {
//     return res.render("login.ejs");
//     // if (req.session.admin) {
//     //     return res.render("./admin/adminmain.ejs", {
//     //         user: req.session.context
//     //     });
//     // } else {
//     //     return res.render("login.ejs", {
//     //         errors: req.session.context
//     //     });
//     // }
// }

// router.get('/', (req, res) => {
//     //res.send('ALO POLICÍA');
//     res.render('login.ejs');
//     console.log('ayuda')  
// });

let Inicio = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    console.log(email)
    try {
        await loginService.BuscarEmail(email).then(async (usuario) => {

            if (!usuario) {

                //req.flash('No existe un usuario con este email: ' + email, message); 
                req.session.context = { errors: (`No existe un usuario con este email: ${email}`) };
                console.log('No existe un usuario con este email: ' + email)
                return res.redirect("/Inicio");
            }
            if (usuario) {
                let match = await loginService.compararContraseñas(password, usuario);
                if (match === true) {
                    if (usuario.Role === 'user') {
                        req.session.user = true;
                        req.session.context = usuario;
                        return res.redirect("/usuario/usuario");
                    }
                    if (usuario.Role === 'admin') {
                        req.session.admin = true;
                        req.session.context = usuario;
                        return res.redirect("/admin/admin");
                    }

                } else {
                    req.session.context = { errors: (`Contraseña incorrecta`) };
                    return res.redirect("/Inicio");
                }
            };
        })
    } catch (err) {
        console.log(err);
        return done(null, false, { message: err });
    }
}


let ObtenerPaginaInicio = (req, res) => {

    res.render("login.ejs", {
        errors: req.session.context
    });
    
    //return res.render("./usuario/usuario.ejs");
    console.log('necesitoayuda');

    if (req.session.user) {
        return res.render("./usuario/usuario.ejs", {
            usuario: req.session.context
        });
    }
    if (req.session.admin) {
        return res.render("./admin/admin.ejs", {
            usuario: req.session.context
        });
    }
    // return res.render("login.ejs", {
    //     errors: req.session.context
    // });
};

// let Login = async (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;  
//     try {
//         await loginService.findUserByEmail(email).then(async (usuario) => {
//             if (!usuario) {
//                 req.session.context = {errors: (`No existe un usuario con este email: ${email}`)};
//                 return res.redirect("/login");
//             }
//             if (usuario) {
//                 let match = await loginService.comparePasswordUser(password, usuario);
//                 if (match === true) {
//                     if (user.Role==='user') {
//                         req.session.user = true;
//                         req.session.context = usuario;
//                         return res.redirect("/user/usermain");
//                     }
//                     if (user.Role==='admin') {
//                         req.session.admin = true;
//                         req.session.context = usuario;
//                         return res.redirect("/admin/adminmain");
//                     }                 

//                 } else {
//                     req.session.context = {errors: (`Contraseña incorrecta`)};
//                     return res.redirect("/login");
//                 }
//             }
//         });
//     } catch (err) {
//         console.log(err);
//         return done(null, false, { message: err });
//     }  
// };

// let HomePage = (req, res) =>{
//     if (req.session.user) {
//         return res.render("./user/usermain.ejs", {
//             user: req.session.context
//         });
//     }
//     if (req.session.admin) {
//         return res.render("./admin/adminmain.ejs", {
//             user: req.session.context
//         });
//     }  
//     return res.render("login.ejs", {
//         errors: req.session.context
//     });
// };

let CerrarSesion = (req, res) => {
    req.session.destroy(function (err) {
        return res.redirect("/Inicio");
    });
};

module.exports = {
    //HomePage: HomePage,
    //LogOut: LogOut,   
   
    ObtenerPaginaInicio: ObtenerPaginaInicio,
    Inicio: Inicio,
    CerrarSesion: CerrarSesion
};