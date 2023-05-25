import axios from "axios";
import { useState, useEffect } from "react";
import { ShowTurno1 } from "./ShowTurno1";
import { ShowTurno2 } from "./ShowTurno2";
const URI = "http://localhost:8000/admin/";

export const ShowTablaVendedor = () => {
  const [ventas, setVentas] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  // Declaración de variables y funciones set
  const [ventasManana, setVentasManana] = useState([]);
  const [ventasTarde, setVentasTarde] = useState([]);

  useEffect(() => {
    // Llamamos a la función getVentas para obtener los datos iniciales
    getVentas();
  });
  useEffect(() => {
    filterVentasByDate();
  }, [selectedDate, ventas]);
  const getVentas = async () => {
    const res = await axios.get(URI);
    const sortedVentas = res.data.sort((a, b) => {
      const dateA = extractDate(a.fecha, a.hora);
      const dateB = extractDate(b.fecha, b.hora);
      return dateB - dateA;
    });
    setVentas(sortedVentas);
  };
  const extractDate = (fecha, hora) => {
    const [day, month, year] = fecha.split("/");
    const [hour, minute, second] = hora.split(":");
    return {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      hour: parseInt(hour),
      minute: parseInt(minute),
      second: parseInt(second),
    };
  };
  const filterVentasByDate = () => {
    let ventasManana = [];
    let ventasTarde = [];

    for (let i = 0; i < ventas.length; i++) {
      const hora = ventas[i].hora;
      const turno = parseInt(hora.split(":")[0]);

      if (turno >= 5 && turno < 14) {
        ventasManana.push(ventas[i]);
      } else if (turno >= 14 && turno < 23) {
        ventasTarde.push(ventas[i]);
      }
    }

    if (selectedDate) {
      const [selectedYear, selectedMonth, selectedDay] =
        selectedDate.split("-");

      const selectedDateObj = {
        day: parseInt(selectedDay),
        month: parseInt(selectedMonth.replace(/^0+/, "")), // Quita el "0" al principio del mes
        year: parseInt(selectedYear),
        hour: 0,
        minute: 0,
        second: 0,
      };
      ventasManana = ventasManana.filter((venta) => {
        const [day, month, year] = venta.fecha.split("/");
        const ventaDate = {
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year),
          hour: 0,
          minute: 0,
          second: 0,
        };

        return (
          ventaDate.day === selectedDateObj.day &&
          ventaDate.month === selectedDateObj.month &&
          ventaDate.year === selectedDateObj.year
        );
      });

      ventasTarde = ventasTarde.filter((venta) => {
        const [day, month, year] = venta.fecha.split("/");
        const ventaDate = {
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year),
          hour: 0,
          minute: 0,
          second: 0,
        };

        return (
          ventaDate.day === selectedDateObj.day &&
          ventaDate.month === selectedDateObj.month &&
          ventaDate.year === selectedDateObj.year
        );
      });
    }
    setVentasManana(ventasManana);
    setVentasTarde(ventasTarde);
  };
  return (
    <div>
      <div className="col">
        <label htmlFor="fecha">Filtrar por fecha:</label>
        <input
          type="date"
          id="fecha"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <ShowTurno1 data={ventasManana} />
      <ShowTurno2 data={ventasTarde} />
    </div>
  );
};
