const jwt = require('jsonwebtoken');
const postgres = require('../database/database')
const auth = require('./AuthControler');
const config = require('../config.js');
const path = require('path');
const multer = require('multer');

class UsuarioControlador {

    async list(req, res) {
        const usuario = await postgres.query('SELECT * FROM usuario');
        res.json(usuario.rows);
    }

    async login(req, res){
        const { usuario, password } = req.body;
        const user = usuario.toLowerCase();
        const cliente = await postgres.query("SELECT * FROM usuario WHERE usuario='"+user+"'");
        if (cliente.rows.length > 0) {
            const contra = auth.authash(cliente.rows[0].password,password);
            if(contra){
                const token = auth.creatToken(cliente.rows[0])

                res.json({usuario, password});
            }
            else
                res.json({ text: "Contraseña Incorrecta" });
        }
        else
            res.json({ text: "Usuario Invalido" });  
    }

    async registro(req, res){
        var { nombre, usuario, telefono,correo, password } = req.body
        usuario = usuario.toLowerCase();
        const contra = auth.encriptacion(password);
        await postgres.query("INSERT INTO usuario (nombre,usuario,telefono,correo,password) VALUES ('"+nombre+"','"+usuario+"','"+telefono+"','"+correo+"','"+contra+"');");
        res.json("Usuario Registrado");
    }

    async update(req, res){
        const { id } = req.params;
        const { nombre, correo, telefono, password } = req.body;
        const nuevo = auth.encriptacion(password)
        await postgres.query("UPDATE usuario SET nombre= '"+nombre+"', correo= '"+correo+"', telefono= '"+telefono+"', password= '"+nuevo+"' WHERE id = '"+id+"'");
        res.json({ message: "Usuario Actualizado" });
    }

    async delete(req, res){
        const { id } = req.params;
        await postgres.query("DELETE FROM usuario WHERE id = '"+id+"'");
        res.json({ message: "Usuario Eliminado" });
    }

    async analizarUsuario(req, res){
        const { usuario } = req.body;
        const usuariomin = usuario.toLowerCase()
        const usuarioSeleccionado = await postgres.query("SELECT * FROM usuario WHERE usuario='"+usuariomin+"'");
        if (usuarioSeleccionado.rows.length > 0)
            return res.json({ text: true });
        res.json({ text: false });
        
    }
    
    ensureToken(req, res){
        console.log("analizando Token");
        var token = req.headers['authorization']
        if (token) {
            token = token.replace('Bearer ', '')
            jwt.verify(token, config.TOKEN_SECRET, function(err, token) {
                if (err) {
                    return res.status(401).send({message: 'Acesso negado'});
                } 
                else {
                    req.token = token
                    res.json({ token });
                }
            });
        }
        else
            res.status(401).send({message: 'Toket inválido'})
    } 
    constructor(){
        let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './src/static/imagenes')
            },
            filename: (req, file, cb) => {
                cb(null, "fiel" + '_' + Date.now() + path.extname(file.originalname))
            }
        });
        let subir = multer({ storage });
        this.dato = subir.single('file');
    }
    async foto(req, res){
        let portada = "http://localhost:3000/"+req.file.path;
        while (true) {
            portada = portada.replace("\\", "/");
            if(portada.indexOf("\\",0)==-1)
                break;
        }
        let max = await postgres.query("SELECT MAX(id) max FROM usuario;");
        max = max.rows[0].max
        await postgres.query("UPDATE usuario SET foto= '"+portada+"' WHERE id = '"+max+"'");
        res.json({ texto: "dato subio" });
    }
}
const controlers = new UsuarioControlador;
module.exports = controlers;
