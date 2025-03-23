import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ListRainfall = () => {
  const { serialNumber } = useParams();
  const [rainfallData, setRainfallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRainfallData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3001/get-by-serialNumber/${serialNumber}/rainfall`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Dados de rainfall:", response.data);
        
        if (!response.data || (!response.data.sensor && !response.data.sensorSoft)) {
          setError("Nenhum dado de rainfall encontrado para este dispositivo.");
        } else {
          setRainfallData(response.data);
        }

        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar dados de rainfall.");
        setLoading(false);
      }
    };

    fetchRainfallData();
  }, [serialNumber]);

  return (
    <div className="container">
      <h1>Dados de Rainfall do Sensor {serialNumber}</h1>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {rainfallData && (
        <div>
          <h2>Sensores Físicos</h2>
          {rainfallData.sensor && rainfallData.sensor.length > 0 ? (
            <ul>
              {rainfallData.sensor.map((sensor) => (
                <li key={sensor.sensorId}>
                  <strong>Tipo:</strong> {sensor.sensorType} | <strong>Unidade:</strong> {sensor.uom}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum sensor físico encontrado.</p>
          )}

          <h2>Soft Sensors</h2>
          {rainfallData.sensorSoft && rainfallData.sensorSoft.length > 0 ? (
            <ul>
              {rainfallData.sensorSoft.map((softSensor) => (
                <li key={softSensor.sensorId}>
                  <strong>Nome:</strong> {softSensor.customName || "Sem Nome"} | 
                  <strong> Unidade:</strong> {softSensor.uom}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum soft sensor encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListRainfall;
