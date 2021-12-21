const express  = require("express");
const controlers = require("../controladores/UserControler");


class UsuarioRoutes {
  
    
    constructor() {
        this.rutas = express();
        this.config();
    }
    
    config() {
        this.rutas.get('/', controlers.list);
        this.rutas.get('/login', controlers.login);
        this.rutas.post('/fichero', controlers.dato, controlers.foto);
        this.rutas.post('/registro', controlers.registro);
        this.rutas.get('/token', controlers.ensureToken);
        this.rutas.get('/auth', controlers.analizarUsuario);
        this.rutas.put('/:id', controlers.update);
        this.rutas.delete('/:id', controlers.delete);
    }

}

module.exports = new UsuarioRoutes().rutas;