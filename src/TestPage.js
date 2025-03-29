import React, { useState, useEffect } from 'react';
import axios from 'axios';
import createApiInstance from './services/apiService';


import { ToastContainer, toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
const TestPage = () => {
  const [apiKey, setApiKey] = useState(""); 
  const [token, setToken] = useState(localStorage.getItem("token") || ""); 
  const [devices, setDevices] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const fetchToken = async () => {
    if (!apiKey) {
      toast.error("Por favor, insira a API Key");
      return;
    }

    try {
      const api = createApiInstance("https://api.oriondata.io/api");

      const response = await api.get(`/Token?apiKey=${apiKey}`);

      console.log("Resposta da API:", response);

      const newToken = String(response.data.token); 
      console.log("Novo Token:", newToken); 

      if (newToken) {
        setToken(newToken); 
        localStorage.setItem("token", newToken);
        toast.success("Token validado com sucesso");

        setTimeout(() => {
          fetchDevices(); 
        }, 2000);
      } else {
        toast.error("Token não encontrado na resposta");
      }
    } catch (error) {
      toast.error("Erro ao validar token");
      console.error("Erro:", error);
    }
  };

  const fetchDevices = async () => {
    const tokenFromLocalStorage = localStorage.getItem('token');
    console.log("Token:", tokenFromLocalStorage);
  
    if (!tokenFromLocalStorage) {
      console.log("Token não encontrado");
      setError("Token não encontrado");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:3001/list-all-devices", {
        headers: {
          Authorization: `Bearer ${tokenFromLocalStorage}`,
        },
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
    if (token) {
      fetchDevices(); 
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 w-96 bg-white shadow-lg rounded-lg">
        {!token ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Validar API Key</h2>
            <input
              type="text"
              placeholder="Digite sua API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-4 w-full p-2 border rounded"
            />
            <button onClick={fetchToken} className="w-full bg-blue-500 text-white p-2 rounded">
              Validar Token
            </button>
          </>
        ) : (
          <div>
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
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TestPage;