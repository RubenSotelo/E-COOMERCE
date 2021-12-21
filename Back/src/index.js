const express  = require("express");
const morgan = require("morgan");
const cors = require("cors");
const UsuarioRoutes = require("./rutas/UserUrl")
const config = require('./config.js');


class Server {

    
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    
    config() {
        this.app.set('port', config.PORT);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/src/static/imagenes/',express.static('./src/static/imagenes'));
    }

    routes() {
        this.app.use('/api/usuario', UsuarioRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}
const server = new Server();
server.start();