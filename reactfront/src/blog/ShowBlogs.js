import axios from "axios";
import { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ShowTabla } from "./ShowTabla";
import { ShowTablaVendedor } from "./ShowTablaVendedor";
import { ShowAnalisis } from "./ShowAnalisis";

const URI = "http://localhost:8000/admin/";

const CompShowventas = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Llamamos a la función getVentas para obtener los datos iniciales
    getVentas();

    // Establecemos un intervalo para actualizar los datos cada medio segundo
    const interval = setInterval(() => {
      getVentas();
    }, 500);

    // Limpiamos el intervalo al desmontar el componente
    return () => {
      clearInterval(interval);
    };
  }, []);

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
    let filtered = ventas;

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

      filtered = filtered.filter((venta) => {
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
    setFilteredVentas(filtered);
  };

  const totalVenta = filteredVentas.reduce(
    (total, venta) => total + venta.totalventa,
    0
  );

  const totalBoletos = filteredVentas.reduce(
    (total, venta) => total + venta.num_boletos,
    0
  );

  return (
    <div className="container">
      <div className="row mt-4"></div>
      <Tabs defaultActiveKey="tab1" id="my-tabs">
        <Tab eventKey="tab1" title="VENTAS GENERALES">
          <div className="col">
            <label htmlFor="fecha">Filtrar por fecha:</label>
            <input
              type="date"
              id="fecha"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <ShowTabla data={{ totalBoletos, totalVenta, filteredVentas }} />
        </Tab>
        <Tab eventKey="tab2" title="VENTAS POR VENDEDOR">
          <ShowTablaVendedor />
        </Tab>
        <Tab eventKey="tab3" title="ANALISIS">
          <ShowAnalisis data={{filteredVentas}} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default CompShowventas;
