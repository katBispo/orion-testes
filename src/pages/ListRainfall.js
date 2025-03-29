import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ListRainfall = () => {
  const { serialNumber } = useParams();
  const [rainfallData, setRainfallData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

        console.log("Resposta completa da API:", response.data);

        const softSensors = response.data?.body?.data?.sensorSoft || [];

        if (softSensors.length > 0) {
          setRainfallData(softSensors);
        } else {
          setError("Nenhum soft sensor encontrado para este dispositivo.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro na requisição:", err);
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

      <div className="cards-container">
        {rainfallData.length > 0 ? (
          rainfallData.map((softSensor) => (
            <div key={softSensor.sensorId} className="card">
              <h3>{softSensor.customName || "Sem Nome"}</h3>
              <p><strong>Tipo:</strong> {softSensor.sensorType}</p>
              <p><strong>Unidade:</strong> {softSensor.uom}</p>
              <button
                id={`sensor-${softSensor.sensorId}`}
                className="btn-more"
                onClick={() => navigate(`/softsensorPageAtual/${softSensor.sensorId}`)}  
              >
                Ver Mais
              </button>
            </div>
          ))
        ) : (
          !loading && <p>Nenhum soft sensor encontrado.</p>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
        }

        .cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }

        .card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          width: 250px;
          text-align: center;
        }

        .card h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .card p {
          margin: 5px 0;
          font-size: 14px;
          color: #555;
        }

        .btn-more {
          margin-top: 10px;
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn-more:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ListRainfall;
