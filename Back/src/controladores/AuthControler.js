const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../config.js');


class AuthControlador {
    encriptacion(password) {
        return bcrypt.hashSync(password ,bcrypt.genSaltSync(10))
    }
    authash(hash, password) {
        return bcrypt.compareSync(password, hash);
    }
    authcorreo(email) {
        return /\S+@\S+\.\S+/.test(email);
    }
    creatToken(usuario) {

        const token = jwt.sign({ usuario }, config.TOKEN_SECRET);
        return token;
    }
}

const auth = new AuthControlador;
module.exports = auth;