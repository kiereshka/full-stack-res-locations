import logo from './logo.png';
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
    const [errorMessage, setErrorMessage] = useState(null);
    const { width, height } = useWindowSize();
    const [triggerConfetti, setTriggerConfetti] = useState(false);

    const handlePointToggle = (index) => {
        const newPoints = [...points];
        if (newPoints[index]) {
            newPoints[index].isHidden = !newPoints[index].isHidden;
        }
        setPoints(newPoints);
    };

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
            const confirmGen = window.confirm(
                '⚠️ Увага!\n\nВипадкова генерація не враховує бюджет напряму.\nДані можуть перевищити обмеження.\n\nБажаєте продовжити?'
            );

            if (!confirmGen) {
                setInputMethod(null);
                setShowModal(true);
                return;
            }

            const generatedData = generateRandomData(points.length, parameters.n, parameters.C);
            setData(generatedData);
        }
    };

    const generateRandomData = (m, n, C) => {
        return Array.from({ length: m }, () => ({
            costs: Array.from({ length: n }, () => Math.floor(Math.random() * 51) + 50), // 50–100
            capacities: Array.from({ length: n }, () => Math.floor(Math.random() * 401) + 100),
        }));
    };

    const handleDataSubmit = (inputData) => {
        setData(inputData);
    };

    const handleRunAlgorithm = async () => {
        setLoading(true);
        setErrorMessage(null);
        setResults(null);
        setTriggerConfetti(false);

        if (!data || data.length !== points.length) {
            setErrorMessage("Некоректні або відсутні дані для точок.");
            setLoading(false);
            return;
        }

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
            const response = await axios.post('/api/Optimization', requestData);
            setResults(response.data);

            const hasSolution = response.data.bestSolution?.some((x) => x === 1);
            if (hasSolution) {
                setTriggerConfetti(true);
                setTimeout(() => setTriggerConfetti(false), 3000);
            }
        } catch (error) {
            const message = error.response?.data || error.message || "Невідома помилка";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToMap = () => {
        setShowModal(false);
        setParameters(null);
        setInputMethod(null);
        setData(null);
        setResults(null);
        setErrorMessage(null);
        setStep('map');
    };

    return (
        <div className="container py-4 position-relative">
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
                <div className="text-center mt-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                    <img src={logo} alt="Логотип" style={{ maxWidth: '200px', marginBottom: '20px' }} />
                    <Button onClick={handleRunAlgorithm} variant="primary">
                        Запустити алгоритм
                    </Button>
                    {errorMessage && (
                        <Alert variant="danger" className="mt-3">
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            )}

            {loading && (
                <div className="text-center mt-3">
                    <Spinner animation="border" role="status" />
                    <div>Обчислення... Зачекайте кілька секунд</div>
                </div>
            )}

            {results && (
                <Alert
                    variant={results.bestSolution?.some((x) => x === 1) ? 'success' : 'danger'}
                    className="text-center mt-4 fs-5"
                >
                    {results.bestSolution?.some((x) => x === 1)
                        ? '🎉 Ваше рішення знайдено! 🏆'
                        : '❗ Рішення не було знайдено через обмеження бюджету або конфлікти'}
                </Alert>
            )}

            {results && <Results data={results} points={points} onPointToggle={handlePointToggle} />}
            {triggerConfetti && <Confetti width={width} height={height} />}
        </div>
    );
};

export default App;