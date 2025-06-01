import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';

const Results = ({ data, points }) => {
    const selectedIndices = data.bestSolution
        .map((val, idx) => (val ? idx : null))
        .filter((i) => i !== null);

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

            <svg width="600" height="600" viewBox="0 0 100 100" style={{ border: '1px solid #ccc' }}>
                {points.map((p, i) => {
                    const included = data.bestSolution[i] === 1;
                    if (!p) return null;
                    return (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={100 - p.y}
                            r="2.5"
                            fill={included ? 'green' : 'red'}
                            stroke="black"
                            strokeWidth="0.5"
                        />
                    );
                })}
            </svg>
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
};

export default Results;