import React, { useState, useEffect } from 'react';
import SetupForm from './components/SetupForm';
import InteractiveMap from './components/InteractiveMap';
import DataInputForm from './components/DataInputForm';
import Results from './components/Results';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import './App.css';

const App = () => {
    const [step, setStep] = useState('map');
    const [points, setPoints] = useState([]);
    const [parameters, setParameters] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [inputMethod, setInputMethod] = useState(null);
    const [data, setData] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [triggerConfetti, setTriggerConfetti] = useState(false);

    const [width, height] = useWindowSize();

    const handlePointsPlaced = (placedPoints) => {
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

    const generateRandomData = (m, n, C) => {
        const maxCostPerRES = Math.floor(C / n);
        return Array.from({ length: m }, () => ({
            costs: Array.from({ length: n }, () => Math.floor(Math.random() * (maxCostPerRES - 50 + 1)) + 50),
            capacities: Array.from({ length: n }, () => Math.floor(Math.random() * 401) + 100),
        }));
    };

    const handleRunAlgorithm = async () => {
        setLoading(true);
        setShowSuccess(false);
        setTriggerConfetti(false);

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

        const start = Date.now();
        try {
            const response = await axios.post('/api/Optimization', requestData);
            const duration = Date.now() - start;
            const delay = Math.max(0, 2000 - duration); // гарантуємо 2 секунди

            setTimeout(() => {
                setResults(response.data);
                setShowSuccess(true);
                setTriggerConfetti(true);
                setLoading(false);
            }, delay);
        } catch (error) {
            setLoading(false);
            alert(`Помилка при виконанні алгоритму: ${error.response?.data || error.message}`);
        }
    };

    const handleBackToMap = () => {
        setShowModal(false);
        setParameters(null);
        setInputMethod(null);
        setData(null);
        setResults(null);
        setShowSuccess(false);
        setTriggerConfetti(false);
        setStep('map');
    };

    // Автоматичне завершення конфеті через 5 секунд
    useEffect(() => {
        if (triggerConfetti) {
            const timer = setTimeout(() => setTriggerConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [triggerConfetti]);

    return (
        <div className="container py-4 position-relative">
            {triggerConfetti && <Confetti width={width} height={height} recycle={false} />}

            {step === 'map' && (
                <InteractiveMap
                    onPointsPlaced={handlePointsPlaced}
                    initialPoints={points}
                />
            )}

            {step === 'parameters' && !parameters && (
                <SetupForm onSubmit={handleParametersSubmit} showM={false} />
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Оберіть спосіб введення даних</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-grid gap-2">
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
                <div className="text-center mt-3">
                    <Button onClick={handleRunAlgorithm} variant="primary">
                        Запустити алгоритм
                    </Button>
                </div>
            )}

            {loading && (
                <div className="text-center mt-3">
                    <Spinner animation="border" role="status" />
                    <div>Обчислення... Зачекайте кілька секунд</div>
                </div>
            )}

            {showSuccess && (
                <Alert variant="success" className="text-center mt-4 fs-5">
                    🎉 Ваше рішення знайдено! 🏆
                </Alert>
            )}

            {results && <Results data={results} points={points} />}
        </div>
    );
};

export default App;
