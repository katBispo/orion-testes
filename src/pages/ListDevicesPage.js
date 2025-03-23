import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Data de Instalação</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(devices) && devices.length > 0 ? (
                  devices.map((device) => (
                    <tr key={device.deviceId}>
                      <td>{device.deviceId}</td>
                      <td>{device.deviceName}</td>
                      <td>{device.status}</td>
                      <td>{device.dateInstalled}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Nenhum dispositivo encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ListDevicesPage;
