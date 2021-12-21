const postgres = require('../database/database')
const auth = require('./AuthControler');
const path = require('path');
var multer = require('multer');

class UsuarioControlador {

    async list(req, res) {
        const productos = await postgres.query('SELECT * FROM producto');
        res.json(productos.rows);
    }

    async creatProduct(req, res){
        let { id_proveedor,nombre,precio,stock,tipo,descripcion } = req.body
        nombre = nombre.toLowerCase();
        await postgres.query("INSERT INTO producto (id_proveedor,nombre,precio,tipo,stock,descripcion) VALUES ('"+id_proveedor+"','"+nombre+"','"+precio+"','"+tipo+"','"+stock+"','"+descripcion+"');");
        res.json("Producto Creado");
    }

    async updateProduct(req, res){
        const { id } = req.params;
        const { id_proveedor,nombre,precio,stock,tipo,descripcion } = req.body;
        await postgres.query("UPDATE producto SET id_proveedor= '"+id_proveedor+"', nombre= '"+nombre+"', precio= '"+precio+"', stock= '"+stock+"', tipo= '"+tipo+"', descripcion= '"+descripcion+"' WHERE id = '"+id+"'");
        res.json({ message: "Producto Actualizado" });
    }

    async deleteProduct(req, res){
        const { id } = req.params;
        await postgres.query("DELETE FROM producto WHERE id = '"+id+"'");
        res.json({ message: "Producto Eliminado" });
    }

    async analizarProducto(req, res){
        let{ id_proveedor,nombre } = req.body;
        nombre = nombre.toLowerCase()
        const producto = await postgres.query("SELECT * FROM producto WHERE nombre = '"+nombre+"'"+"and id_proveedor = '"+id_proveedor+"'");
        if (usuarioSeleccionado.rows.length > 0)
            return res.json({ text: true });
        res.json({ text: false });
        
    }
    constructor(){
        let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './src/static/imagenes')
            },
            filename: (req, file, cb) => {
                cb(null, "imag_" +  Date.now() + path.extname(file.originalname))
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
        let max = await postgres.query("SELECT MAX(id) max FROM producto;");
        max = max.rows[0].max
        await postgres.query("UPDATE imange SET foto= '"+portada+"' WHERE id = '"+max+"'");
        res.json({ texto: "dato subio" });
    }
}
const controlers = new UsuarioControlador;
module.exports = controlers;