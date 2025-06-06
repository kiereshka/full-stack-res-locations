import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import 'bootstrap/dist/css/bootstrap.min.css';

const Results = ({ data, points, onPointToggle }) => {
    const selectedIndices = data.bestSolution
        .map((val, idx) => (val ? idx : null))
        .filter((i) => i !== null);

    const [scale, setScale] = useState(100); // Масштаб

    const handleScaleChange = (e) => {
        setScale(Number(e.target.value));
    };

    const scaleFactor = 600 / scale; // Масштаб для переведення координат в пікселі

    return (
        <div className="container mt-4">
            <h2>Результати</h2>
            <p><strong>Вибрані локації:</strong></p>
            <ul>
                {selectedIndices.map((i) => (
                    points[i] ? (
                        <li key={i}>Локація {i + 1}: ({points[i].x.toFixed(2)}, {points[i].y.toFixed(2)})</li>
                    ) : null
                ))}
            </ul>

            <p><strong>Максимальна потужність:</strong> {data.maxCapacity}</p>
            <p><strong>Загальна вартість:</strong> {data.totalCost}</p>

            <div className="my-3">
                <label><strong>Масштаб координат:</strong></label>
                <select value={scale} onChange={handleScaleChange} className="form-select w-auto d-inline-block ms-2">
                    <option value={10}>10 × 10</option>
                    <option value={100}>100 × 100</option>
                    <option value={200}>200 × 200</option>
                    <option value={500}>500 × 500</option>
                </select>
            </div>

            <div style={{ border: '1px solid #ccc', height: '80vh' }}>
                <TransformWrapper>
                    <TransformComponent>
                        <svg width={600} height={600}>
                            {/* Сітка та осі */}
                            {[...Array(scale / 10 + 1)].map((_, i) => {
                                const val = i * 10;
                                const pos = 600 - val * scaleFactor;
                                return (
                                    <g key={i}>
                                        <line x1={0} y1={pos} x2={600} y2={pos} stroke="#eee" strokeWidth="1" />
                                        <text x={0} y={pos - 2} fontSize="10" fill="#888">{val}</text>
                                        <line x1={val * scaleFactor} y1={0} x2={val * scaleFactor} y2={600} stroke="#eee" strokeWidth="1" />
                                        <text x={val * scaleFactor + 2} y={10} fontSize="10" fill="#888">{val}</text>
                                    </g>
                                );
                            })}

                            {/* Точки */}
                            {points.map((p, i) => {
                                if (!p) return null;
                                const included = data.bestSolution[i] === 1;
                                return (
                                    <circle
                                        key={i}
                                        cx={p.x * scaleFactor}
                                        cy={600 - p.y * scaleFactor}
                                        r={5}
                                        fill={included ? 'green' : 'red'}
                                        stroke="black"
                                        strokeWidth="1"
                                        onClick={() => onPointToggle(i)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                );
                            })}
                        </svg>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    );
};

Results.propTypes = {
    data: PropTypes.shape({
        bestSolution: PropTypes.arrayOf(PropTypes.number).isRequired,
        maxCapacity: PropTypes.number.isRequired,
        totalCost: PropTypes.number,
    }).isRequired,
    points: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    })).isRequired,
    onPointToggle: PropTypes.func.isRequired,
};

export default Results;