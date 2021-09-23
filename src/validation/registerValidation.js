import {check} from "express-validator";
//VALIDAR 
let validarRegistro = [
    check("email", "Correo invalido").isEmail().trim(),

    check("password", "Contraseña invalida. Debe tener al menos 8 caracteres")
    .isLength( {min: 8,max: 250}),

    check("confirmationPassword", "Las contraseñas no coinciden")
    .custom((value, { req }) => {
        return value === req.body.password
    })
];
//RESET-PASSWORD
let validateNewPassword = [
    check("password", "Contraseña invalida. Debe tener al menos 8 caracteres")
    .isLength( {max: 250}),

    check("password2", "Las contraseñas no coinciden")
    .custom((value, { req }) => {
        return value === req.body.password
    })
];

module.exports = {
    validarRegistro: validarRegistro,
    validateNewPassword: validateNewPassword
};