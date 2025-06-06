import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const SetupForm = ({ onSubmit, showM }) => {
    const [n, setN] = useState(5);
    const [C, setC] = useState(5000);
    const [d, setD] = useState(20); // нове поле: відстань

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ n, C, d });
    };

    return (
        <Form onSubmit={handleSubmit} className="setup-form mx-auto mt-5">
            {showM && (
                <Form.Group className="mb-3">
                    <Form.Label>Кількість точок (M)</Form.Label>
                    <Form.Control type="number" value={m} disabled />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label>Кількість типів РЕС (N)</Form.Label>
                <Form.Control
                    type="number"
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    min={1}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Бюджет (C)</Form.Label>
                <Form.Control
                    type="number"
                    value={C}
                    onChange={(e) => setC(Number(e.target.value))}
                    min={0}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>Мінімальна відстань між точками (D)</Form.Label>
                <Form.Control
                    type="number"
                    value={d}
                    onChange={(e) => setD(Number(e.target.value))}
                    min={0}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Продовжити
            </Button>
        </Form>
    );
};

export default SetupForm;
