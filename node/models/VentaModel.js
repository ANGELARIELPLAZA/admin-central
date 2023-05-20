import mongoose from "mongoose";
const Schema = mongoose.Schema;

let ventaSchema = new Schema({
  destino_code: {
    type: Number,
    required: true,
  },
  num_boletos: {
    type: Number,
    default: 1,
    required: true,
  },
  descuento: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  vendedor: {
    type: String,
    required: true,
  },
  nombre_ruta: {
    type: String,
    required: true,
  },
  caja: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  totalventa: {
    type: Number,
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
});

export default  mongoose.model("Venta", ventaSchema);
