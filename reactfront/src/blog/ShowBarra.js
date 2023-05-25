import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const ShowBarra = ({ data }) => {
  // Crear un objeto para almacenar la suma de totalventa por nombre_ruta y num_boletos
  const sumByNombreRuta = {};
  const sumByNumBoletos = {};

  // Iterar sobre los datos para calcular la suma de totalventa y num_boletos por nombre_ruta
  data.forEach(item => {
    if (sumByNombreRuta[item.nombre_ruta]) {
      sumByNombreRuta[item.nombre_ruta] += item.totalventa;
      sumByNumBoletos[item.nombre_ruta] += item.num_boletos;
    } else {
      sumByNombreRuta[item.nombre_ruta] = item.totalventa;
      sumByNumBoletos[item.nombre_ruta] = item.num_boletos;
    }
  });

  // Crear un nuevo array de datos con la suma de totalventa y num_boletos por nombre_ruta
  const sumData = Object.keys(sumByNombreRuta).map(nombre_ruta => ({
    nombre_ruta,
    totalventa: sumByNombreRuta[nombre_ruta],
    num_boletos: sumByNumBoletos[nombre_ruta],
  }));

  return (
    <div>
      <BarChart width={1300} height={300} data={sumData}>
        <XAxis dataKey="nombre_ruta" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Tooltip content={<CustomTooltipWithStyles />} />
        <Legend />
        <Bar dataKey="totalventa" fill="#6495ED" />
      </BarChart>
    </div>
  );
};
 

  
  // Estilos CSS para el tooltip
  const tooltipStyles = {
    background: '#fff',
    border: '1px solid #ccc',
    padding: '10px',
  };
  
  // Aplicar estilos al componente CustomTooltip
  const CustomTooltipWithStyles = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Obtener los datos de la barra seleccionada
      return (
        <div className="custom-tooltip" style={tooltipStyles}>
          <p>{`Ruta: ${label}`}</p>
          <p>{`Ganancia de la ruta: $${data.totalventa}`}</p>
          <p>{`Boletos: ${data.num_boletos}`}</p>
          <p>{`Cancelados: SIN INFORMACION`}</p>
        </div>
      );
    }
    return null;
  };
  