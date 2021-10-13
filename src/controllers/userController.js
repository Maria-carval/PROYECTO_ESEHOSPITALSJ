import connection from "../configs/connectDB";
//import userService from "../services/userService";
import jwt from "jsonwebtoken";

//FUNCIÓN PARA LA PÁGINA PRINCIPAL DEL MÓDULO USUARIO
let getUser = (req, res) => {
    if (req.session.user) {
        return res.render("./usuario/usuario.ejs", {
            user: req.session.context
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
}

module.exports = {
    getUser: getUser,    
}