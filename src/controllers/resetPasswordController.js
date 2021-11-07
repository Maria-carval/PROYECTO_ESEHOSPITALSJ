require('dotenv').config();
import loginService from "../services/loginService"
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import connection from "../configs/connectDB";


let RestaurarPage = (req, res, next) => {
    const {id, token} = req.params;
    console.log(id);
    console.log(token)
    return new Promise(async (resolve, reject) =>{
        try {        
        let user = await loginService.BuscarId(id)
        if (!user) {
            return res.send(`No cambie el link de conexión.`);
        } else {
            if (Number(id) !== user.idusuario){
                console.log(user.idusuario);  
                console.log(typeof user.idusuario);
                console.log(id);
                console.log(typeof id);
                return res.send('ID inválida. No cambie el link de conexión.')
            }

            let JWT_SECRET = process.env.JWT_SECRET;
            const secret = JWT_SECRET + user.Password
            try {
                const payload = jwt.verify(token, secret);
                res.render("reset-password",
                {Correo: user.Correo, token: token, id: id});
                
            } catch (error) {
                console.log(error.message);
                res.send(error.message);
            }
        }
        } catch (e) {
            reject(e);
        }
    });  
    
};

let ChangePassword = (req, res, next) => {    
    //const {id, token} = req.params;
    //const {password, password2} = req.body;
    var password = req.body.password;
    var id = req.body.id;
    var token = req.body.token;
    console.log(password)
    return new Promise(async (resolve, reject) =>{
        let user = await loginService.BuscarId(id);
       console.log(user.Nombres)
        try {          
            if (!user) {
                return res.send(`No cambie el link de conexión.`);
            } else {               
                try {                              
                    let hash = await bcrypt.hash(password,10);
                    connection.query(
                        `UPDATE usuario SET Password = ? WHERE idusuario = ?`, [hash, user.idusuario],
                        function(err, rows) {
                           
                            if (err) {
                                console.log(err);
                            }                            
                        }
                    );
                    return res.redirect("/Inicio");
                } catch (error) {
                    console.log('aaaaaaaaaaaaaaaaaa');
                    console.log(error.message);
                    res.send(error.message);
                }
            }
        } catch (e) {           
            reject(e);
        }
    });
}

module.exports = {
    RestaurarPage: RestaurarPage,
    ChangePassword: ChangePassword
}