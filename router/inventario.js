const { Router } = require("express")
const Inventario = require("../models/Inventario")
const { validationResult, check } = require("express-validator")
const bcrypt = require("bcryptjs");
const {validarJWT} = require("../middleware/validar-jwt")
const { validarRolAdmin } = require("../middleware/validad-rol-admin")


const router = Router();

//GET method route 
router.get("/", async function (req, res) {

    try {
        const inventarios = await Inventario.find().populate([
            {
                path: "usuario", select: "nombre email estado"
            },
            {
                path: "marca", select: "nombre estado"
            },
            {
                path: "estadoEquipo", select: "nombre estado"
            },
            {
                path: "tipoEquipo", select: "nombre estado"
            }
        ]);

        res.send(inventarios);

    } catch (error){
        console.log(error)
        res.status(500).send("ocurrio un error al listar inventarios");
    }
});

//POST method router
router.post("/", [validarJWT],[validarRolAdmin], [
    check("serial", "invalid.serial").not().isEmpty(),
    check("modelo", "invalid.modelo").not().isEmpty(),
    check("descripcion", "invalid.descripcion").not().isEmpty(),
    check("foto", "invalid.foto").not().isEmpty(),
    check("color", "invalid.color").not().isEmpty(),
    check("precio", "invalid.precio").not().isEmpty(),
    check("fechaCompra", "invalid.fechaCompra").not().isEmpty(),
    check("usuario", "invalid.usuario").not().isEmpty(),
    check("marca", "invalid.marca").not().isEmpty(),
    check("estadoEquipo", "invalid.estadoEquipo").not().isEmpty(),
    check("tipoEquipo", "invalid.tipoEquipo").not().isEmpty(),

], async function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const exiteInventarioPorSerial = await Inventario.findOne({ serial: req.body.serial });
        if (exiteInventarioPorSerial) {
            return res.status(400).send("ya existe este serial en otro equipo");
        }

        let inventario = new Inventario();
        inventario.serial = req.body.serial
        inventario.modelo = req.body.modelo
        inventario.descripcion = req.body.descripcion
        inventario.foto = req.body.foto
        inventario.color = req.body.color
        inventario.precio = req.body.precio
        inventario.fechaCompra = req.body.fechaCompra
        inventario.usuario = req.body.usuario
        inventario.marca = req.body.marca
        inventario.estadoEquipo = req.body.estadoEquipo
        inventario.tipoEquipo = req.body.tipoEquipo
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save()
        res.send(inventario);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("ocurrio un error")
    }


})

//PUT method route
router.put('/:id', [validarJWT],[validarRolAdmin], async (req, res) => {
    try {
        // Obtén la fecha actual
        const fechaActual = new Date();

        // Agrega la fecha actual al cuerpo de la solicitud
        req.body.fechaActualizacion = fechaActual;

        const inventarioActualizado = await Inventario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Devuelve el usuario actualizado
        );

        if (!inventarioActualizado) {
            return res.status(404).json({ mensaje: 'inventario no encontrado' });
        }

        res.json(inventarioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el inventario', error });
    }
});




//DELETE method route
router.delete("/",[validarJWT],[validarRolAdmin], async (req, res) => {
    try {
        const deletedInventario = await Inventario.findByIdAndDelete( req.body._id);
        if (!deletedInventario) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }
        res.json({ message: 'Inventario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el inventario', error });
    }
});


module.exports = router