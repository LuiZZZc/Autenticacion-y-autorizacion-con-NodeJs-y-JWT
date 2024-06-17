const { Schema, model} = require("mongoose")

const TipoEquipoSchema = Schema({
    nombre: { type: String, required: true},
    estado: {type: String, requiered: true, enum: ["Activo", "Inactivo"]},
    fechaCreacion: {type: Date, required: true},
    fechaActualizacion: {type: Date, required: true}
});

module.exports = model("tipoEquipo", TipoEquipoSchema);