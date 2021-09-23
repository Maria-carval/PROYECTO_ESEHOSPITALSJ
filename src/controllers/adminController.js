import connection from "../configs/connectDB";
//import adminService from "../services/adminService";
import jwt from "jsonwebtoken";

//FUNCIÓN PARA LA PÁGINA PRINCIPAL DEL MÓDULO USUARIO
let getAdmin = (req, res) => {
    if (req.session.admin) {
        return res.render("./admin/admin.ejs", {
            user: req.session.context
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
}

module.exports = {
    getAdmin: getAdmin,
}