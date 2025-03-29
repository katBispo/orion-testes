import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// YYYY-MM-DD
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};

const SoftSensorPageAtual = () => {
    const { sensorId } = useParams();
    const [sensorData, setSensorData] = useState(null);

    const [rainfallData, setRainfallData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);

    useEffect(() => {
        const fetchRainfallData = async () => {
            try {
                const token = localStorage.getItem("token");

                const endDate = new Date();
                const startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - 1);

                // Função para formatar a data no formato YYYY-MM-DD
                const formatDate = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                const formattedStartDate = formatDate(startDate);
                const formattedEndDate = formatDate(endDate);

                const response = await axios.get(
                    `http://localhost:3001/get-info-sensor?startDate=${formattedStartDate}&endDate=${formattedEndDate}&offset=${offset}&softSensorId=${sensorId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log("Resposta completa da API:", response.data);

                const newData = response.data?.body?.data || [];

                if (newData.length > 0) {
                    setRainfallData((prevData) => [...prevData, ...newData]);
                    setOffset((prevOffset) => prevOffset + 1);
                } else {
                    setHasMoreData(false);
                }

                setLoading(false);
            } catch (err) {
                console.error("Erro na requisição:", err);
                setError("Erro ao carregar dados de rainfall.");
                setLoading(false);
            }
        };

        if (hasMoreData) {
            fetchRainfallData();
        }
    }, [sensorId, offset, hasMoreData]); // Dependências para refazer a requisição

    const handleLoadMore = () => {
        if (hasMoreData) {
            setOffset(offset + 1);
        }
    };

    return (
        <div className="container">
            <h1>Detalhes do Sensor {sensorId}</h1>
            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}

            <div className="data-card">
                {rainfallData.length > 0 ? (
                    rainfallData.map((dataItem, index) => (
                        <div key={index} className="data-card">
                            <p><strong>Data:</strong> {dataItem.date}</p>
                            <p><strong>Valor:</strong> {dataItem.value}</p>
                            <p><strong>Unidade:</strong> {dataItem.uom}</p>
                        </div>
                    ))
                ) : (
                    !loading && <p>Nenhum dado encontrado para este sensor.</p>
                )}
            </div>

            {hasMoreData && (
                <button className="btn-load-more" onClick={handleLoadMore}>
                    Carregar Mais
                </button>
            )}

            <style jsx>{`
        .container {
          padding: 20px;
        }

        .data-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .data-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          text-align: left;
        }

        .data-card p {
          margin: 5px 0;
          font-size: 14px;
          color: #555;
        }

        .btn-load-more {
          margin-top: 20px;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background-color: #28a745;
          color: white;
          cursor: pointer;
        }

        .btn-load-more:hover {
          background-color: #218838;
        }
      `}</style>
        </div>
    );
};

export default SoftSensorPageAtual;
