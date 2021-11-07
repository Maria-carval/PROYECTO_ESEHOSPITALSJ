require('dotenv').config();
import registerService from "../services/registerService";
import loginService from "../services/loginService"
import gmailController from "../controllers/gmailController"
import jwt from 'jsonwebtoken';

let forgot = (req, res) => {
    return res.render("forgot-password.ejs", {
        errors: req.session.noexist
    });
};

let checkaccountforgot = (req, res, next) => {
    const { Correo } = req.body;
    console.log(Correo)
    return new Promise(async (resolve, reject) => {
        try {           
            let check = await registerService.validarCorreo(Correo);
            if (!check) {
                console.log(check);
                req.session.noexist = { errors: (`No existe un usuario con este correo: ${Correo}`) };
                return res.redirect("/Olvidarpassword");
            } else {
                //create 1 time link
                let JWT_SECRET = process.env.JWT_SECRET;
                let user = await loginService.BuscarEmail(Correo)
                const secret = JWT_SECRET + user.Password
                const payload = {
                    Correo: Correo,
                    id: user.idusuario
                }
                const token = jwt.sign(payload, secret, { expiresIn: '30m' });
                const link = `http://localhost:4000/Restaurarpassword/${user.idusuario}/${token}`;
                console.log(link);
                const body = `<h4>Estimado/a ${user.Nombres} ${user.Apellidos}</h4>
                                Para recuperar la contraseña de su cuenta, por favor acceder al siguiente link:
                              <hr class="my-4">
                                 ${link}
                              <hr class="my-4">
                              <div class="text-center mb-2">
                                ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
                                 <a href="#" class="register-link">
                                 (57) (5) 6868098
                                 </a>
                                 <p><small><em>Por favor no responder este correo.</em></small></p>
                              </div>`

                gmailController.sendEmail(user.Correo, 'Recuperar contraseña E.S.E Hospital San Jacinto', body);
                // req.session.fperror = { msg: (`El link para recuperar la contraseña ha sido enviado a su correo.`) };
                // return res.redirect("/Inicio");
            }
        } catch (e) {
            reject(e);
        }
    });
};

let Rest = (req, res) => {
    return res.render("forgot-passwordRest.ejs", {
        msg: req.session.fperror
    });
};

module.exports = {
    forgot: forgot,
    checkaccountforgot: checkaccountforgot,
    Rest: Rest
}