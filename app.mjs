//Este módulo es utilizado para crear errores HTTP con una sintaxis similar a la de las respuestas HTTP.
import createError from 'http-errors';
//Este módulo es el framework de Node.js utilizado para crear la aplicación web.
import express from 'express';
//Este módulo es utilizado para trabajar con rutas de archivos y directorios.
import path from 'path';
//Este middleware se utiliza para analizar las cookies que se envían en las solicitudes HTTP.
import cookieParser from 'cookie-parser';
//Este middleware se utiliza para registrar los detalles de las solicitudes HTTP en la consola.
import logger from 'morgan';
//Este middleware se utiliza para anular el método HTTP utilizado en una solicitud HTTP y reemplazarlo con otro método.
import methodOverride from 'method-override';
//Este módulo es utilizado para leer la configuración de la aplicación desde un archivo llamado config.mjs.

//GRID
//Estos módulos se utilizan para manejar la carga de archivos en la aplicación web. 
//multer es un middleware de Express utilizado para manejar la carga de archivos en la aplicación, mientras que multer-gridfs-storage proporciona una forma de almacenar archivos cargados en MongoDB.
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
//Este módulo se utiliza para generar identificadores únicos y aleatorios.
import crypto from 'crypto';
//Este middleware se utiliza para habilitar la política de mismo origen de CORS en la aplicación, lo que permite que los recursos de la aplicación web sean accesibles desde otros orígenes.
import cors from 'cors';
//router
import imageRouter from './routes/image.mjs';
import './config/bd.mjs'
import config from './config.mjs'
const app = express();

// view engine setup
app.set('views', path.join(import.meta.url, 'views'));
app.set('view engine', 'jade');
//Aquí se utiliza el middleware CORS para permitir que cualquier origen acceda a los recursos de la aplicación.
app.use(cors({
    origin: '*',
}));
//Aquí se utiliza el middleware morgan para registrar detalles de las solicitudes HTTP en la consola.
app.use(logger('dev'));
//Aquí se utilizan los middlewares express.json() y express.urlencoded() para analizar los cuerpos de las solicitudes HTTP con formato JSON y URL-encoded, respectivamente.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Aquí se utiliza el middleware cookie-parser para analizar las cookies que se envían en las solicitudes HTTP.
app.use(cookieParser());
//Aquí se utiliza el middleware method-override para anular el método HTTP utilizado en una solicitud HTTP y reemplazarlo con otro método. En este caso, se utiliza el parámetro _method para reemplazar el método HTTP en la solicitud.
app.use(methodOverride('_method'));

app.use(express.static(path.join(import.meta.url, 'public')));


//GridFs Configuration
// create storage engine
const storage = new GridFsStorage({
    url: config.mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

app.use('/', imageRouter(upload));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
