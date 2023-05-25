import React from "react";
import DataTable from "react-data-table-component";
const columns = [
  {
    name: <h4>Vendedora</h4>,
    selector: (row) => row.vendedor,
    sortable: true,
  },
  {
    name: <h4>Tipo de boleto</h4>,
    selector: (row) => row.nombre_ruta,
    sortable: true,
  },
  {
    name: <h4>Descuento</h4>,
    selector: (row) => row.descuento,
    sortable: true,
  },
  {
    name: <h4>Precio</h4>,
    selector: (row) => row.totalventa,
    sortable: true,
    cell: (row) => `$${row.totalventa}`,
  },  {
    name: <h4>Fecha</h4>,
    selector: (row) => row.fecha,
    sortable: true,
  },  {
    name: <h4>Hora</h4>,
    selector: (row) => row.hora,
    sortable: true,
  },
];
export const ShowTurno2 = ({ data }) => {
  const totalVentaturno = data.reduce((total, data) => total + data.totalventa, 0);
  const totalBoletosturno = data.reduce(
    (total, data) => total + data.num_boletos,
    0
  );
  // Obtener las vendedoras únicas
  const uniqueVendedoras = [...new Set(data.map((venta) => venta.vendedor))];

  return (
    <div>
      <h1>Turno 2</h1>
      <div className="row mt-4">
        <div className="col">
          <div className="card">
          <div className="card-body custom-card">
              <div className="row">
                <div className="col">
                  <h5 className="card-title">Ganancias TURNO 2</h5>
                  <p className="card-text">${totalVentaturno}</p>
                </div>
                <div className="col">
                  <h5 className="card-title">Boletos TURNO 2</h5>
                  <p className="card-text">{totalBoletosturno}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        {uniqueVendedoras.map((vendedora, index) => {
          // Filtrar las ventas por vendedora
          const ventasVendedora = data.filter(
            (venta) => venta.vendedor === vendedora
          );

          // Calcular el monto total y el número de boletos para la vendedora
          const totalVentaVendedora = ventasVendedora.reduce(
            (total, venta) => total + venta.totalventa,
            0
          );
          const totalBoletosVendedora = ventasVendedora.reduce(
            (total, venta) => total + venta.num_boletos,
            0
          );

          return (
            <div key={index} className="col">
              <div className="card">
              <div className="card-body custom-card">
                  <h5 className="card-title">{vendedora}</h5>
                  <div className="row">
                <div className="col">
                  <p className="card-text"> Ganancias: ${totalVentaVendedora}</p>
                </div>
                <div className="col">
                  <p className="card-text">  Boletos: {totalBoletosVendedora}</p>
                </div>
              </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        persistTableHead
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50, 100]}
      />
    </div>
  );
};
