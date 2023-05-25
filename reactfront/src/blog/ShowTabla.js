import React from "react";
import { ShowBarra } from "./ShowBarra";
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
  },
  {
    name: <h4>Fecha</h4>,
    selector: (row) => row.fecha,
    sortable: true,
  },
  {
    name: <h4>Hora</h4>,
    selector: (row) => row.hora,
    sortable: true,
  },
];

export const ShowTabla = ({ data }) => {
  const { totalBoletos, totalVenta, filteredVentas } = data;
  // Ordenar los datos en forma descendente por hora
  const sortedData = filteredVentas.sort((a, b) =>
    b.hora.localeCompare(a.hora)
  );
  return (
    <div>
      <div className="row mt-4">
        <div className="col">
          <div className="card">
          <div className="card-body custom-card">
            <h5 className="card-title">Ganancias del dia </h5>
              <p className="card-text">${totalVenta}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
          <div className="card-body custom-card">
              <h5 className="card-title">Boletos del dia</h5>
              <p className="card-text">{totalBoletos}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <DataTable
            columns={columns}
            data={filteredVentas}
            pagination
            persistTableHead
            paginationPerPage={3}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50, 100]}
          />
        </div>
      </div>
      <ShowBarra data={filteredVentas} />
    </div>
  );
};
