import loginService from "../services/loginService";
const flash = require('connect-flash');


let Inicio = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    console.log(email)
    try {
        await loginService.BuscarEmail(email).then(async (usuario) => {

            if (!usuario) {           
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

};

let CerrarSesion = (req, res) => {
    req.session.destroy(function (err) {
        return res.redirect("/Inicio");
    });
};

module.exports = {    
    ObtenerPaginaInicio: ObtenerPaginaInicio,
    Inicio: Inicio,
    CerrarSesion: CerrarSesion
};