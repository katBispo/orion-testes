import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const ListRainfall = () => {
    const { serialNumber } = useParams(); // Pega o serialNumber da URL
    const [rainfallData, setRainfallData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token] = useState(localStorage.getItem("token") || "");
  
    useEffect(() => {
      const fetchRainfallData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/get-by-serialNumber/${serialNumber}/rainfall`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          console.log("Dados de rainfall:", response.data);
  
          if (response.data && response.data.body) {
            setRainfallData(response.data.body);
          } else {
            setError("Nenhum dado de rainfall encontrado.");
          }
  
          setLoading(false);
        } catch (error) {
          setError("Erro ao carregar dados de rainfall.");
          setLoading(false);
          console.error("Erro na requisição:", error);
        }
      };
  
      fetchRainfallData();
    }, [serialNumber, token]); // Recarrega a requisição sempre que o serialNumber mudar
  
    return (
      <div className="rainfall-container">
        <h2>Dados de Rainfall do Sensor {serialNumber}</h2>
        {loading ? (
          <p>Carregando dados de rainfall...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            {rainfallData.length > 0 ? (
              <ul>
                {rainfallData.map((sensor, index) => (
                  <li key={index}>
                    <p>Sensor ID: {sensor.id}</p>
                    <p>Valor: {sensor.value}</p>
                    <p>Última atualização: {new Date(sensor.lastUpdate).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum dado de rainfall encontrado para este dispositivo.</p>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default ListRainfall;