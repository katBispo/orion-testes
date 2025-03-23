import React, { useState } from "react";
import createApiInstance from '../services/apiService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; 

const TokenFetcher = () => {
  const [apiKey, setApiKey] = useState(""); 
  const navigate = useNavigate(); 

  const fetchToken = async () => {
    if (!apiKey) {
      toast.error("Por favor, insira a API Key");
      return;
    }

    try {
      const api = createApiInstance("https://api.oriondata.io/api");

      const response = await api.get(`/Token?apiKey=${apiKey}`);

      const newToken = String(response.data.token); 
      console.log("Novo Token:", newToken);

      if (newToken) {
        localStorage.setItem("token", newToken); 
        toast.success("Token validado com sucesso");

        setTimeout(() => {
          navigate("/list-devices"); 
        }, 2000);
      } else {
        toast.error("Token não encontrado na resposta");
      }
    } catch (error) {
      toast.error("Erro ao validar token");
      console.error("Erro:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 w-96 bg-white shadow-lg rounded-lg">
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default TokenFetcher;