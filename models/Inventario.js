const { Schema, model} = require("mongoose")

const InventarioSchema = Schema({
    serial: { type: String, required: true, unique: true },
    modelo : { type: String, required: true },
    descripcion: {type: String, requiered: true },
    foto: {type: String, required: true},
    color: {type: String, required: true },
    precio: { type: Number, required: true },
    fechaCompra: {type: Date, required: true},
    usuario: { type: Schema.Types.ObjectId, ref: "usuario", requerid: true },
    marca: { type: Schema.Types.ObjectId, ref: "marca", requirid: true },
    estadoEquipo: { type: Schema.Types.ObjectId, ref: "estadoEquipo", requirid: true },
    tipoEquipo: { type: Schema.Types.ObjectId, ref: "tipoEquipo", requirid: true },
    fechaCreacion: {type: Date, required: true},
    fechaActualizacion: {type: Date, required: true}
});

module.exports = model("inventario", InventarioSchema);