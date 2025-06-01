import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SetupForm = ({ onSubmit }) => {
    const [m, setM] = useState(30);
    const [n, setN] = useState(50);
    const [d, setD] = useState(5);
    const [C, setC] = useState(5000);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedM = parseInt(m, 10);
        const parsedN = parseInt(n, 10);
        const parsedD = parseInt(d, 10);
        const parsedC = parseInt(C, 10);
        if (isNaN(parsedM) || parsedM <= 0) {
            alert('m must be a positive integer');
            return;
        }
        if (isNaN(parsedN) || parsedN <= 0) {
            alert('n must be a positive integer');
            return;
        }
        if (isNaN(parsedD) || parsedD <= 0) {
            alert('d must be a positive integer');
            return;
        }
        if (isNaN(parsedC) || parsedC <= 0) {
            alert('C must be a positive integer');
            return;
        }
        onSubmit({ m: parsedM, n: parsedN, d: parsedD, C: parsedC });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Кількість локацій (m)</Form.Label>
                <Form.Control type="number" min="1" value={m} onChange={(e) => setM(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Кількість RES (n)</Form.Label>
                <Form.Control type="number" min="1" value={n} onChange={(e) => setN(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Мінімальна дистанція (d)</Form.Label>
                <Form.Control type="number" min="1" value={d} onChange={(e) => setD(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Бюджет (C)</Form.Label>
                <Form.Control type="number" min="1" value={C} onChange={(e) => setC(e.target.value)} />
            </Form.Group>
            <Button type="submit">Далі</Button>
        </Form>
    );
};

SetupForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default SetupForm;