require('dotenv').config();
import Routes from "./routes/index";
const express = require('express'); //Se requiere el framework de express
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');

const jwt = require('express-jwt');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');

const app = express(); //Se inicializa el servidor

//const secret = {secret: process.env.SECRET || 'secret'}

//CONFIGURACIÓN DE SESSION
app.use(cookieParser ('secret'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge: 160 * 60 * 1000 //86400000 1hour
    }
}));

// app.use(passport.initialize);
// app.use(passport.session);
//Para habilitar los flash message en caso de error utilizados en la página de inicio de sesión y registro
app.use(flash());


//CONFIGURACIÓN DE EXPRESS
app.set('port', process.env.PORT || 3000);

//MIDDLEWARES
app.use(morgan('dev')); //Sirve para mostrar por consola el tipo de peticiones se le han pedido al servidor 
app.use(express.json());//Cada vez que se reciba info en formato Json, el navegador puede entenderlo
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(express.urlencoded({ extended: true }));
//RUTAS
//app.use(require('../configs/connectDB'))
Routes(app);
//app.use(require('./routes/index'));


//CONFIGURAR VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//ARCHIVOS ESTÁTICOS
console.log(__dirname + '/public')
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'))
});