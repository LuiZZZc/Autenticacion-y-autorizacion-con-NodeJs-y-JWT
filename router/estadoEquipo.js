const { Router } = require("express")
const EstadoEquipo = require("../models/EstadoEquipo")
const { validationResult, check } = require("express-validator")
const { validarJWT } = require("../middleware/validar-jwt")
const { validarRolAdmin } = require("../middleware/validad-rol-admin")

const router = Router();

//GET method route 
router.get("/",[validarJWT],[validarRolAdmin], async function (req, res) {

    try {
        const estadoEquipos = await EstadoEquipo.find(); //select * estadoEquipos;
        res.send(estadoEquipos)
    } catch (error) {
        console.log(error);
    }
});

//POST method router
router.post("/",[validarJWT],[validarRolAdmin], [
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"]),
    
], async function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }


        let estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save()
        res.send(estadoEquipo);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("ocurrio un error")
    }


})

module.exports = router