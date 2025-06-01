import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import PropTypes from 'prop-types';

const DataInputForm = ({ m, n, onSubmit }) => {
    const [inputData, setInputData] = useState(
        Array.from({ length: m }, () => ({
            costs: Array(n).fill(0),
            capacities: Array(n).fill(0),
        }))
    );

    const handleChange = (i, j, type, value) => {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed < 0) return;

        const newData = [...inputData];
        newData[i][type][j] = parsed;
        setInputData(newData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputData);
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <h3>Введення вартостей та потужностей</h3>
            {inputData.map((row, i) => (
                <div key={i} className="mb-4">
                    <h5>Локація {i + 1}</h5>
                    <div className="row">
                        {row.costs.map((_, j) => (
                            <div key={j} className="col-6 col-md-3 mb-2">
                                <label>Вартість {j + 1}</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={inputData[i].costs[j]}
                                    onChange={(e) => handleChange(i, j, 'costs', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        {row.capacities.map((_, j) => (
                            <div key={j} className="col-6 col-md-3 mb-2">
                                <label>Потужність {j + 1}</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={inputData[i].capacities[j]}
                                    onChange={(e) => handleChange(i, j, 'capacities', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <button type="submit" className="btn btn-success">Зберегти</button>
        </form>
    );
};

DataInputForm.propTypes = {
    m: PropTypes.number.isRequired,
    n: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default DataInputForm;
