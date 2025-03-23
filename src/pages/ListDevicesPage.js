import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./a.css";

const ListDevicesPage = () => {
  const [token] = useState(localStorage.getItem("token") || "");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:3001/list-all-devices", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Resposta completa da API:", response.data);

      if (!response.data || !response.data.body || !response.data.body.data) {
        console.error("Dados inválidos recebidos:", response.data);
        setError("Dados inválidos recebidos da API");
        setLoading(false);
        return;
      }

      const devicesList = Object.values(response.data.body.data);
      setDevices(devicesList);
      setLoading(false);
    } catch (error) {
      setError("Erro ao carregar dispositivos");
      setLoading(false);
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);


 
  const handleViewMore = (serialNumber) => {
    // Redirecionar para a página ListRainfall, passando o serialNumber como parâmetro na URL
    navigate(`/list-rainfall/${serialNumber}`);
  };

  return (
    <div className="devices-container">
      <h2>Lista de Dispositivos</h2>
      {loading ? (
        <p>Carregando dispositivos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        devices.map((device) => (
          <div key={device.serialNumber} className="device-card">
            <h3>{device.name}</h3>
            <p>Status: {device.status}</p>
            <p>Última atualização: {new Date(device.lastUpdate).toLocaleString()}</p>

            {/* Botão "Ver Mais" para cada dispositivo */}
            <button
              onClick={() => handleViewMore(device.serialNumber)}
              id={device.serialNumber}
            >
              Ver Mais
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ListDevicesPage;