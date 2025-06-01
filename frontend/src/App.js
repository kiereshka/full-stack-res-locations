import React, { useState } from 'react';
import SetupForm from './components/SetupForm';
import InteractiveMap from './components/InteractiveMap';
import DataInputForm from './components/DataInputForm';
import Results from './components/Results';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

const App = () => {
    const [parameters, setParameters] = useState(null);
    const [points, setPoints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [inputMethod, setInputMethod] = useState(null);
    const [data, setData] = useState(null);
    const [results, setResults] = useState(null);

    const handleParametersSubmit = (params) => {
        setParameters(params);
        setPoints([]);
        setInputMethod(null);
        setData(null);
        setResults(null);
    };

    const handlePointsPlaced = (placedPoints) => {
        setPoints(placedPoints);
        setShowModal(true);
    };

    const handleInputMethodSelect = (method) => {
        setInputMethod(method);
        setShowModal(false);
        if (method === 'random') {
            const generatedData = generateRandomData(parameters.m, parameters.n, parameters.C);
            setData(generatedData);
        }
    };

    const handleDataSubmit = (inputData) => {
        setData(inputData);
    };

    const handleRunAlgorithm = async () => {
        const requestData = {
            m: parameters.m,
            n: parameters.n,
            d: parameters.d,
            C: parameters.C,
            locations: points.map((p, i) => ({
                x: p.x,
                y: p.y,
                costs: data[i].costs,
                capacities: data[i].capacities,
            })),
        };
        try {
            const response = await axios.post('/api/Optimization', requestData);
            setResults(response.data);
        } catch (error) {
            console.error('Error running algorithm:', error);
            alert('Помилка при виконанні алгоритму. Перевірте підключення до сервера.');
        }
    };

    const generateRandomData = (m, n, C) => {
        const maxCostPerRES = Math.floor(C / n);
        return Array.from({ length: m }, () => ({
            costs: Array.from({ length: n }, () => Math.floor(Math.random() * (maxCostPerRES - 50 + 1)) + 50),
            capacities: Array.from({ length: n }, () => Math.floor(Math.random() * 401) + 100),
        }));
    };

    return (
        <div className="container">
            {!parameters && <SetupForm onSubmit={handleParametersSubmit} />}
            {parameters && points.length === 0 && (
                <div className="map-container">
                    <InteractiveMap m={parameters.m} onPointsPlaced={handlePointsPlaced} />
                </div>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Оберіть спосіб введення даних</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-buttons">
                    <Button onClick={() => handleInputMethodSelect('manual')}>Введення вручну</Button>
                    <Button onClick={() => handleInputMethodSelect('random')}>Випадкова генерація</Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowModal(false);
                            setPoints([]);
                        }}
                    >
                        Повернутися до карти
                    </Button>
                </Modal.Body>
            </Modal>
            {inputMethod === 'manual' && !data && (
                <div className="form-container">
                    <DataInputForm m={points.length} n={parameters.n} onSubmit={handleDataSubmit} />
                </div>
            )}
            {data && !results && (
                <Button onClick={handleRunAlgorithm}>Запустити алгоритм</Button>
            )}
            {results && <Results data={results} points={points} />}
        </div>
    );
};

export default App;