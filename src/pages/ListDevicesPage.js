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
    navigate(`/list-rainfall/${serialNumber}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 w-96 bg-white shadow-lg rounded-lg">
        {loading ? (
          <div>Carregando dispositivos...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            <h1>Lista de Dispositivos</h1>
            <div className="devices-container">
              {devices.map((device) => (
                <div key={device.deviceId} className="device-card">
                  <h2>{device.deviceName}</h2>
                  <p><strong>Status:</strong> {device.status}</p>
                  <p><strong>Última atualização:</strong> {new Date(device.lastUpload).toLocaleString()}</p>
                  <button 
                    className="view-more-btn" 
                    onClick={() => handleViewMore(device.serialNumber)}
                  >
                    Ver Mais
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListDevicesPage;