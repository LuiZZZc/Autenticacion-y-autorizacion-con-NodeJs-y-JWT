const { Router } = require("express")
const Usuario = require("../models/Usuario")
const { validationResult, check } = require("express-validator")
const bcrypt = require("bcryptjs");
const { validarJWT } = require("../middleware/validar-jwt")
const { validarRolAdmin } = require("../middleware/validad-rol-admin");
const { now } = require("mongoose");

const router = Router();

//GET method route 
router.get("/", [validarJWT],[validarRolAdmin], async function (req, res) {

    try {
        const usuarios = await Usuario.find(); //select * usuarios;
        res.send(usuarios)
    } catch (error) {
        console.log(error);
        res.status(500).send("Error de usuario");
    }
});

//POST method router
router.post("/",[validarJWT],[validarRolAdmin], [
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("email", "invalid.email").isEmail(),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"]),
    check("password", "invalid.password").not().isEmpty(),
    check("rol", "invalid.rol").isIn(["Administrador", "Docente"])

], async function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const exitesUsuario = await Usuario.findOne({ email: req.body.email })
        if (exitesUsuario) {
            return res.status(400).send("email ya existe");
        }   

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(req.body.password, salt);
        usuario.password = password; 

        usuario.rol = req.body.rol;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();
    

        usuario = await usuario.save();
        res.send(usuario);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("ocurrio un error")
    }


});

//PUT method route
router.put('/:id', [validarJWT],[validarRolAdmin], async (req, res) => {
    try {
        // Obtén la fecha actual
        const fechaActual = new Date();

        // Agrega la fecha actual al cuerpo de la solicitud
        req.body.fechaActualizacion = fechaActual;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Devuelve el usuario actualizado
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el usuario', error });
    }
});




//DELETE method route
router.delete("/",[validarJWT],[validarRolAdmin], async (req, res) => {
    try {
        const deletedUsuario = await Usuario.findByIdAndDelete( req.body._id);
        if (!deletedUsuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
});

module.exports = router