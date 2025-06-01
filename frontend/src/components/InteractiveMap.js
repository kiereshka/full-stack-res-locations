import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'; // Виправлено імпорт
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './InteractiveMap.css';

const InteractiveMap = ({ onPointsPlaced, initialPoints = [] }) => {
    const [points, setPoints] = useState(initialPoints);
    const [dragging, setDragging] = useState(null);
    const svgRef = useRef(null);

    const GRID_SIZE = 100;
    const GRID_STEP = 10;

    const snapToGrid = (x, y) => {
        const snappedX = Math.round(Math.max(0, Math.min(x, GRID_SIZE)) / GRID_STEP) * GRID_STEP;
        const snappedY = Math.round(Math.max(0, Math.min(y, GRID_SIZE)) / GRID_STEP) * GRID_STEP;
        return { x: snappedX, y: snappedY };
    };

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const svg = svgRef.current;
        if (!svg) {
            console.error('SVG ref is null');
            return;
        }

        const rect = svg.getBoundingClientRect();
        const scaleX = GRID_SIZE / rect.width;
        const scaleY = GRID_SIZE / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (rect.height - (event.clientY - rect.top)) * scaleY;
        const snappedPoint = snapToGrid(x, y);

        console.log('Click coordinates:', { rawX: x, rawY: y, snappedPoint, existingPoints: points });

        const exists = points.some(p => p.x === snappedPoint.x && p.y === snappedPoint.y);
        if (!exists) {
            setPoints([...points, snappedPoint]);
        } else {
            alert(`Точка з координатами (${snappedPoint.x}, ${snappedPoint.y}) вже існує.`);
        }
    };

    const handleMouseDown = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mouse down on point:', index);
        setDragging(index);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging !== null) {
                const svg = svgRef.current;
                if (!svg) return;

                const rect = svg.getBoundingClientRect();
                const scaleX = GRID_SIZE / rect.width;
                const scaleY = GRID_SIZE / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (rect.height - (e.clientY - rect.top)) * scaleY;
                const snappedPoint = snapToGrid(x, y);

                console.log('Dragging point:', { x, y, snappedPoint });

                const newPoints = [...points];
                if (!newPoints.some((p, i) => i !== dragging && p.x === snappedPoint.x && p.y === snappedPoint.y)) {
                    newPoints[dragging] = snappedPoint;
                    setPoints(newPoints);
                }
            }
        };

        const handleMouseUp = () => {
            if (dragging !== null) {
                console.log('Mouse up, dragging stopped');
                setDragging(null);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, points]);

    const handleConfirm = () => {
        if (points.length === 0) {
            alert('Розмістіть хоча б одну точку перед підтвердженням.');
            return;
        }
        if (typeof onPointsPlaced !== 'function') {
            console.error('onPointsPlaced is not a function:', onPointsPlaced);
            return;
        }
        console.log('Confirming points:', points);
        onPointsPlaced(points);
    };

    const gridLines = [];
    for (let i = 0; i <= GRID_SIZE; i += GRID_STEP) {
        gridLines.push(
            <line key={`v${i}`} x1={i} y1="0" x2={i} y2={GRID_SIZE} stroke="#e0e0e0" strokeWidth="0.5" />,
            <line key={`h${i}`} x1="0" y1={i} x2={GRID_SIZE} y2={i} stroke="#e0e0e0" strokeWidth="0.5" />
        );
    }

    const axisLabels = [];
    for (let i = 0; i <= GRID_SIZE; i += GRID_STEP) {
        axisLabels.push(
            <text key={`x${i}`} x={i} y={GRID_SIZE + 5} fontSize="4" textAnchor="middle">{i}</text>,
            <text key={`y${i}`} x="-5" y={GRID_SIZE - i + 1} fontSize="4" textAnchor="end">{i}</text>
        );
    }

    const colors = ['#007bff', '#dc3545', '#28a745', '#ffc107', '#6f42c1', '#fd7e14'];

    return (
        <div className="map-wrapper">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={5}
                disabled={dragging !== null}
                wheel={{ disabled: true }}
                doubleClick={{ disabled: true }}
                panning={{ disabled: dragging !== null }}
            >
                <TransformComponent>
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="600px"
                        viewBox="-10 -10 120 120"
                        onClick={handleClick}
                        className="map-svg"
                    >
                        {gridLines}
                        <line x1="0" y1={GRID_SIZE} x2={GRID_SIZE} y2={GRID_SIZE} stroke="#333" strokeWidth="1" />
                        <line x1="0" y1="0" x2="0" y2={GRID_SIZE} stroke="#333" strokeWidth="1" />
                        <text x={GRID_SIZE + 5} y={GRID_SIZE} fontSize="6" fill="#333">X</text>
                        <text x="0" y="-5" fontSize="6" fill="#333">Y</text>
                        {axisLabels}
                        {points.map((p, i) => (
                            <g key={i}>
                                <circle
                                    cx={p.x}
                                    cy={GRID_SIZE - p.y}
                                    r="3"
                                    fill={colors[i % colors.length]}
                                    stroke="#fff"
                                    strokeWidth="1"
                                    className="map-point"
                                    onMouseDown={(e) => handleMouseDown(i, e)}
                                />
                                <text
                                    x={p.x + 4}
                                    y={GRID_SIZE - p.y - 2}
                                    fontSize="4"
                                    fill={colors[i % colors.length]}
                                    className="map-point-label"
                                >
                                    ({p.x}, {p.y})
                                </text>
                            </g>
                        ))}
                    </svg>
                </TransformComponent>
            </TransformWrapper>
            <Button onClick={handleConfirm} className="map-button">
                Підтвердити розташування
            </Button>
        </div>
    );
};

InteractiveMap.propTypes = {
    onPointsPlaced: PropTypes.func.isRequired,
    initialPoints: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        })
    ),
};

InteractiveMap.defaultProps = {
    initialPoints: [],
};

export default InteractiveMap;