import axios from "axios";
import { useState, useEffect } from "react";

const URI = "http://localhost:8000/admin/";

const CompShowventas = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    getVentas();
  }, []);

  useEffect(() => {
    filterVentasByDate();
  }, [selectedDate]);

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
      second: parseInt(second)
    };
  };

  const filterVentasByDate = () => {
    if (selectedDate) {
      const [selectedYear,selectedMonth ,selectedDay ] = selectedDate.split("-");

      const selectedDateObj = {
        day: parseInt(selectedDay),
        month: parseInt(selectedMonth.replace(/^0+/, '')), // Quita el "0" al principio del mes
        year: parseInt(selectedYear),
        hour: 0,
        minute: 0,
        second: 0
      };

      const filtered = ventas.filter((venta) => {
        const [day, month, year] = venta.fecha.split("/");
        console.log(month)
        const ventaDate = {
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year),
          hour: 0,
          minute: 0,
          second: 0
        };

        return ( 
          ventaDate.day === selectedDateObj.day &&
          ventaDate.month === selectedDateObj.month &&
          ventaDate.year === selectedDateObj.year
        );
      });
      setFilteredVentas(filtered);
    } else {
      setFilteredVentas(ventas);
    }
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
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total de ventas</h5>
              <p className="card-text">${totalVenta}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total de boletos</h5>
              <p className="card-text">{totalBoletos}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <label htmlFor="fecha">Filtrar por fecha:</label>
          <input
            type="date"
            id="fecha"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <table className="table">
            <thead className="tableTheadBg">
              <tr>
                <th>Vendedor</th>
                <th>Tipo de descuento</th>
                <th>Total de venta</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {filteredVentas.map((venta, index) => (
                <tr key={index}>
                  <td>{venta.vendedor}</td>
                  <td>%{venta.descuento}</td>
                  <td>${venta.totalventa}</td>
                  <td>{venta.fecha}</td>
                  <td>{venta.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompShowventas;
