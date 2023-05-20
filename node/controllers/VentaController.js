"use strict";
import Venta from "../models/VentaModel.js";

export const listarVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error al listar las ventas" });
  }
};
export const obtenerVenta = async (req, res) => {
  try {
    var fechaActual = new Date();
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1; // Los meses comienzan desde 0, por lo que se suma 1
    var anio = fechaActual.getFullYear();
    // Formatear la fecha en el formato deseado
    var fecha = dia + "/" + mes + "/" + anio;
    const ventas = await Venta.find({ vendedor: req.params.vendedor });
    const ventasMismoDia = [];
    let ventaFecha = "";

    for (let i = 0; i < ventas.length; i++) {
      ventaFecha = ventas[i].fecha;
      if (ventaFecha === fecha) {
        ventasMismoDia.push(ventas[i]);
      }
    }
    // Ordenar por hora de menor a mayor
    ventasMismoDia.sort((a, b) => {
      const horaA = a.hora.split(":");
      const horaB = b.hora.split(":");
      const minutosA = parseInt(horaA[0]) * 60 + parseInt(horaA[1]);
      const minutosB = parseInt(horaB[0]) * 60 + parseInt(horaB[1]);
      return minutosB - minutosA;
    });

    res.json(ventasMismoDia);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      mensaje: "Hubo un error al obtener las ventas",
    });
  }
};
export const corteVentasGeneral = async (req, res) => {
  try {
    var fechaActual = new Date();
    var dia = fechaActual.getDate()-1;
    var mes = fechaActual.getMonth() + 1; // Los meses comienzan desde 0, por lo que se suma 1
    var anio = fechaActual.getFullYear();
    // Formatear la fecha en el formato deseado
    var fecha = dia + "/" + mes + "/" + anio;
    const ventas = await Venta.find();
    const ventasMismoDia = [];
    let ventaFecha = "";
    for (let i = 0; i < ventas.length; i++) {
      ventaFecha = ventas[i].fecha;
      if (ventaFecha === fecha) {
        ventasMismoDia.push(ventas[i]);
      }
    }
    // Ordenar por hora de menor a mayor
    ventasMismoDia.sort((a, b) => {
      const horaA = a.hora.split(":");
      const horaB = b.hora.split(":");
      const minutosA = parseInt(horaA[0]) * 60 + parseInt(horaA[1]);
      const minutosB = parseInt(horaB[0]) * 60 + parseInt(horaB[1]);
      return minutosB - minutosA;
    });

    res.json(ventasMismoDia);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      mensaje: "Hubo un error al obtener las ventas",
    });
  }
};
export const corteVentas = async (req, res) => {
  try {
    var fechaActual = new Date();
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1; // Los meses comienzan desde 0, por lo que se suma 1
    var anio = fechaActual.getFullYear();
    // Formatear la fecha en el formato deseado
    var fecha = dia + "/" + mes + "/" + anio;
    // Obtener solo la fecha en formato legible
    const ventas = await Venta.find({ vendedor: req.params.vendedor });
    // Filtrar ventas del mismo día
    const ventasMismoDia = [];
    let ventaFecha = "";
    for (let i = 0; i < ventas.length; i++) {
      ventaFecha = ventas[i].fecha;
      if (ventaFecha === fecha) {
        ventasMismoDia.push(ventas[i]);
      }
    }
    // Sumar número de boletos por ruta
    const ventasPorRuta = {};
    for (let i = 0; i < ventasMismoDia.length; i++) {
      const venta = ventasMismoDia[i];
      if (venta.nombre_ruta in ventasPorRuta) {
        ventasPorRuta[venta.nombre_ruta] += parseInt(venta.num_boletos);
      } else {
        ventasPorRuta[venta.nombre_ruta] = parseInt(venta.num_boletos);
      }
    }

    // Convertir a formato deseado
    const resultadoFinal = [];
    for (const nombre_ruta in ventasPorRuta) {
      resultadoFinal.push({
        nombre_ruta,
        total_boletos: ventasPorRuta[nombre_ruta],
      });
    }
    res.json(resultadoFinal);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      mensaje: "Hubo un error al obtener las ventas",
    });
  }
};
export const crearVenta = async (req, res, next) => {
  try {
    const ventas = req.body;
    if (!Array.isArray(ventas) || ventas.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No se encontraron datos de venta válidos",
      });
    }

    const ventasCreadas = [];
    for (const venta of ventas) {
      const {
        code,
        num_boleto,
        descuento,
        token,
        vendedor,
        destino,
        total,
        caja,
        totalventa,
        fecha,
        hora,
      } = venta;

      if (
        !code ||
        !num_boleto ||
        !descuento ||
        !token ||
        !vendedor ||
        !destino ||
        !total ||
        !caja ||
        !totalventa ||
        !fecha ||
        !hora
      ) {
        return res.status(400).json({
          status: "error",
          message: "Faltan datos en la venta",
        });
      }

      const ventaNueva = new Venta({
        destino_code: code,
        descuento,
        token,
        vendedor,
        nombre_ruta: destino,
        total,
        totalventa,
        caja,
        fecha,
        hora,
      });

      const ventaGuardada = await ventaNueva.save();
      ventasCreadas.push(ventaGuardada);
    }

    res.status(201).json({
      status: "success",
      mensaje: "Ventas creadas exitosamente",
      ventas: ventasCreadas,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ status: "error", mensaje: "Error en el servidor" });
    } else if (error.code === 11000) {
      res.status(400).json({ status: "error", mensaje: "La venta ya existe" });
    } else {
      res
        .status(500)
        .json({ status: "error", mensaje: "Hubo un error al crear la venta" });
    }
    next();
  }
};
