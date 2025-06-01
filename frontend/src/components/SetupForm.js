import React, { useState } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SetupForm = ({ onSubmit, showM }) => {
    const [n, setN] = useState(50);
    const [d, setD] = useState(5);
    const [C, setC] = useState(5000);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedN = parseInt(n, 10);
        const parsedD = parseInt(d, 10);
        const parsedC = parseInt(C, 10);
        if (isNaN(parsedN) || parsedN <= 0) {
            alert('n має бути додатним цілим числом');
            return;
        }
        if (isNaN(parsedD) || parsedD <= 0) {
            alert('d має бути додатним цілим числом');
            return;
        }
        if (isNaN(parsedC) || parsedC <= 0) {
            alert('C має бути додатним цілим числом');
            return;
        }
        onSubmit({ n: parsedN, d: parsedD, C: parsedC });
    };

    return (
        <Form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '20px auto' }}>
            <FloatingLabel controlId="formN" label="Кількість RES (n)" className="mb-3">
                <Form.Control
                    type="number"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    min="1"
                    required
                />
            </FloatingLabel>
            <FloatingLabel controlId="formD" label="Мінімальна дистанція (d)" className="mb-3">
                <Form.Control
                    type="number"
                    value={d}
                    onChange={(e) => setD(e.target.value)}
                    min="1"
                    required
                />
            </FloatingLabel>
            <FloatingLabel controlId="formC" label="Бюджет (C)" className="mb-3">
                <Form.Control
                    type="number"
                    value={C}
                    onChange={(e) => setC(e.target.value)}
                    min="1"
                    required
                />
            </FloatingLabel>
            <Button type="submit" variant="primary" className="w-100">
                Далі
            </Button>
        </Form>
    );
};

SetupForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    showM: PropTypes.bool,
};

SetupForm.defaultProps = {
    showM: true,
};

export default SetupForm;