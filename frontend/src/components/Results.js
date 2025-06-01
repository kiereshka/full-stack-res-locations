import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';

const Results = ({ data, points }) => {
    const selectedPoints = data.bestSolution.map(index => points[index]);
    return (
        <div className="container mt-4">
            <h2>Результати</h2>
            <p><strong>Вибрані локації:</strong></p>
            <ul>
                {selectedPoints.map((p, i) => (
                    <li key={i}>Локація {data.bestSolution[i] + 1}: ({p.x.toFixed(2)}, {p.y.toFixed(2)})</li>
                ))}
            </ul>
            <p><strong>Максимальна потужність:</strong> {data.maxCapacity}</p>
        </div>
    );
};

Results.propTypes = {
    data: PropTypes.shape({
        bestSolution: PropTypes.arrayOf(PropTypes.number).isRequired,
        maxCapacity: PropTypes.number.isRequired,
    }).isRequired,
    points: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    })).isRequired,
};

export default Results;