import React, { useState, useEffect } from 'react';
import axios from 'axios';
import createApiInstance from './services/apiService';


import { ToastContainer, toast } from 'react-toastify'; // Para as notificações de erro/sucesso
import { useNavigate } from 'react-router-dom';
const TestPage = () => {
  const [apiKey, setApiKey] = useState(""); // Para armazenar a API Key
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Para armazenar o token, buscando no localStorage caso já tenha sido salvo
  const [devices, setDevices] = useState([]); // Inicializando com array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializando o hook de navegação

  // Função para buscar o token
  const fetchToken = async () => {
    if (!apiKey) {
      toast.error("Por favor, insira a API Key");
      return;
    }

    try {
      // Criando a instância do API com URL específica para a requisição do Token
      const api = createApiInstance("https://api.oriondata.io/api");

      // Fazendo a requisição para a API externa
      const response = await api.get(`/Token?apiKey=${apiKey}`);

      // Adicionando um log para ver a resposta da API
      console.log("Resposta da API:", response);

      // Acessando corretamente o token da resposta
      const newToken = String(response.data.token); // Convertendo explicitamente para string
      console.log("Novo Token:", newToken); // Verifique aqui o que está sendo recebido

      if (newToken) {
        setToken(newToken); // Salvando o token no estado
        localStorage.setItem("token", newToken); // Armazenando o token no localStorage
        toast.success("Token validado com sucesso");

        // Redireciona para a página de dispositivos após o sucesso
        setTimeout(() => {
          fetchDevices(); // Chama a função para buscar os dispositivos
        }, 2000);
      } else {
        toast.error("Token não encontrado na resposta");
      }
    } catch (error) {
      toast.error("Erro ao validar token");
      console.error("Erro:", error);
    }
  };

  // Função para buscar os dispositivos
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
  
      console.log("Resposta completa da API:", response.data); // LOG DA RESPOSTA PARA VERIFICAR A ESTRUTURA
  
      // Garantir que `data` existe antes de acessar
      if (!response.data || !response.data.body || !response.data.body.data) {
        console.error("Dados inválidos recebidos:", response.data);
        setError("Dados inválidos recebidos da API");
        setLoading(false);
        return;
      }
  
      // Converte o objeto `data` para um array
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
      fetchDevices(); // Chama a função para buscar os dispositivos assim que o token é salvo
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