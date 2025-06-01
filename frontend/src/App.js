import React, { useState } from 'react';
import SetupForm from './components/SetupForm';
import InteractiveMap from './components/InteractiveMap';
import DataInputForm from './components/DataInputForm';
import Results from './components/Results';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

const App = () => {
    const [step, setStep] = useState('map');
    const [points, setPoints] = useState([]);
    const [parameters, setParameters] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [inputMethod, setInputMethod] = useState(null);
    const [data, setData] = useState(null);
    const [results, setResults] = useState(null);

    const handlePointsPlaced = (placedPoints) => {
        console.log('Points placed:', placedPoints);
        setPoints(placedPoints);
        setStep('parameters');
    };

    const handleParametersSubmit = (params) => {
        setParameters({ ...params, m: points.length });
        setShowModal(true);
    };

    const handleInputMethodSelect = (method) => {
        setInputMethod(method);
        setShowModal(false);
        if (method === 'random') {
            const generatedData = generateRandomData(points.length, parameters.n, parameters.C);
            setData(generatedData);
        }
    };

    const handleDataSubmit = (inputData) => {
        setData(inputData);
    };

    const handleRunAlgorithm = async () => {
        const requestData = {
            M: points.length,
            N: parameters.n,
            D: parameters.d,
            C: parameters.C,
            Locations: points.map((p, i) => ({
                X: p.x,
                Y: p.y,
                Costs: data[i].costs.map(Number),
                Capacities: data[i].capacities.map(Number),
            })),
        };
        try {
            console.log('Sending request:', requestData);
            const response = await axios.post('/api/Optimization', requestData);
            console.log('Response:', response.data);
            setResults(response.data);
        } catch (error) {
            console.error('Error running algorithm:', error.response?.data || error.message);
            alert(`Помилка при виконанні алгоритму: ${error.response?.data || error.message}`);
        }
    };

    const generateRandomData = (m, n, C) => {
        const maxCostPerRES = Math.floor(C / n);
        return Array.from({ length: m }, () => ({
            costs: Array.from({ length: n }, () => Math.floor(Math.random() * (maxCostPerRES - 50 + 1)) + 50),
            capacities: Array.from({ length: n }, () => Math.floor(Math.random() * 401) + 100),
        }));
    };

    const handleBackToMap = () => {
        setShowModal(false);
        setParameters(null);
        setInputMethod(null);
        setData(null);
        setResults(null);
        setStep('map');
    };

    return (
        <div className="container">
            {step === 'map' && (
                <div className="map-container">
                    <InteractiveMap
                        onPointsPlaced={handlePointsPlaced}
                        initialPoints={points}
                    />
                </div>
            )}
            {step === 'parameters' && !parameters && (
                <SetupForm onSubmit={handleParametersSubmit} showM={false} />
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Оберіть спосіб введення даних</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-buttons">
                    <Button onClick={() => handleInputMethodSelect('manual')}>Введення вручну</Button>
                    <Button onClick={() => handleInputMethodSelect('random')}>Випадкова генерація</Button>
                    <Button variant="secondary" onClick={handleBackToMap}>
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
                <Button onClick={handleRunAlgorithm} variant="primary" className="mt-2">
                    Запустити алгоритм
                </Button>
            )}
            {results && <Results data={results} points={points} />}
        </div>
    );
};

export default App;