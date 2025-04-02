import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/SoftSensorPageAtual.css";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const SoftSensorPageAtual = () => {
    const { sensorId } = useParams();
    const { softSensorId } = useParams();

    const [rainfallData, setRainfallData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [totalCount, setTotalCount] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const isFetching = useRef(false);

    useEffect(() => {
        const fetchRainfallData = async () => {
            if (isFetching.current || !hasMoreData) return;
            isFetching.current = true;

            try {
                const token = localStorage.getItem("token");
                const endDate = new Date();
                const startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - 1);

                const formattedStartDate = formatDate(startDate);
                const formattedEndDate = formatDate(endDate);

                const response = await axios.get(
                    `http://localhost:3001/get-info-sensor?startDate=${formattedStartDate}&endDate=${formattedEndDate}&offset=${offset}&softSensorId=${sensorId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log("Resposta completa da API:", JSON.stringify(response.data, null, 2));
                const newData = response.data?.body?.data?.data || [];
                const total = response.data?.body?.data?.totalCount || null;

                if (total !== null) setTotalCount(total);

                if (newData.length > 0) {
                    setRainfallData((prevData) => [...prevData, ...newData]);
                    setOffset((prevOffset) => prevOffset + 1);
                }

                if (newData.length === 0 || (totalCount !== null && rainfallData.length + newData.length >= totalCount)) {
                    setHasMoreData(false);
                }
            } catch (err) {
                console.error("Erro na requisição:", err);
                setError("Erro ao carregar dados.");
            } finally {
                setLoading(false);
                isFetching.current = false;
            }
        };

        fetchRainfallData();
    }, [sensorId, offset]);

    const handleLoadMore = () => {
        if (hasMoreData) {
            setOffset((prevOffset) => prevOffset + 1);
        }
    };

    const handleToggleHistory = () => {
        setShowHistory(!showHistory);
    };

    const exceededValues = rainfallData.filter(dataItem => dataItem.sensorValue > 50 || dataItem.sensorValue > 70);

    return (
        <div className="container">
            <h1>Detalhes do Sensor {sensorId}</h1>
            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}

            <p>
                {exceededValues.length > 0
                    ? "Alguns sensores atingiram o gatilho de 50 ou 70 mm."
                    : "Nenhum sensor atingiu o gatilho de 70 ou 50 mm."}
            </p>

            <button className="btn-history" onClick={handleToggleHistory}>
                {showHistory ? "Ocultar Histórico" : "Mostrar Histórico"}
            </button>

            {showHistory && (
                <div className="data-card">
                    {rainfallData.length > 0 ? (
                        rainfallData.map((dataItem, index) => (
                            <div key={index} className="data-card">
                                <p><strong>Data:</strong> {formatDateTime(dataItem.readingDate)}</p>
                                <p><strong>Valor:</strong> {dataItem.sensorValue}</p>
                            </div>
                        ))
                    ) : (
                        !loading && <p>Nenhum dado encontrado para este sensor.</p>
                    )}
                </div>
            )}

            {hasMoreData && (
                <button className="btn-load-more" onClick={handleLoadMore}>
                    Carregar Mais
                </button>
            )}
        </div>
    );
};

export default SoftSensorPageAtual;
