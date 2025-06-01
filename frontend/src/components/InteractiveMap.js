import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const InteractiveMap = ({ m, onPointsPlaced }) => {
    const [points, setPoints] = useState([]);
    const [isPlacing, setIsPlacing] = useState(true);
    const [dragging, setDragging] = useState(null);
    const svgRef = useRef(null);

    // Обмеження координат до цілочисельних значень (0-1000)
    const snapToGrid = (x, y) => ({
        x: Math.round(Math.max(0, Math.min(x, 1000))),
        y: Math.round(Math.max(0, Math.min(y, 1000))),
    });

    const handleClick = (event) => {
        if (points.length < m && isPlacing) {
            const svg = svgRef.current;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
            const snappedPoint = snapToGrid(svgPoint.x, svgPoint.y);
            setPoints([...points, snappedPoint]);
            if (points.length + 1 === m) {
                setIsPlacing(false);
            }
        }
    };

    const handleMouseDown = (index, e) => {
        e.stopPropagation();
        setDragging(index);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging !== null) {
                const svg = svgRef.current;
                if (svg) {
                    const point = svg.createSVGPoint();
                    point.x = e.clientX;
                    point.y = e.clientY;
                    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
                    const snappedPoint = snapToGrid(svgPoint.x, svgPoint.y);
                    const newPoints = [...points];
                    newPoints[dragging] = snappedPoint;
                    setPoints(newPoints);
                }
            }
        };

        const handleMouseUp = () => {
            setDragging(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, points]);

    const handleConfirm = () => {
        onPointsPlaced(points);
    };

    // Генерація сітки
    const gridLines = [];
    for (let i = 0; i <= 1000; i += 50) {
        gridLines.push(
            <line key={`v${i}`} x1={i} y1="0" x2={i} y2="1000" stroke="#ddd" strokeWidth="1" />,
            <line key={`h${i}`} x1="0" y1={i} x2="1000" y2={i} stroke="#ddd" strokeWidth="1" />
        );
    }

    return (
        <TransformWrapper>
            <TransformComponent>
                <svg
                    ref={svgRef}
                    width="100%"
                    height="100vh"
                    viewBox="0 0 1000 1000"
                    onClick={handleClick}
                    style={{ backgroundColor: '#f0f0f0' }}
                >
                    {/* Сітка */}
                    {gridLines}
                    {/* Точки */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="5"
                                fill="blue"
                                onMouseDown={(e) => handleMouseDown(i, e)}
                            />
                            <text x={p.x + 10} y={p.y} fontSize="12" fill="black">
                                ({p.x}, {p.y})
                            </text>
                        </g>
                    ))}
                </svg>
            </TransformComponent>
            {!isPlacing && (
                <Button onClick={handleConfirm} className="mt-2">
                    Підтвердити розташування
                </Button>
            )}
        </TransformWrapper>
    );
};

InteractiveMap.propTypes = {
    m: PropTypes.number.isRequired,
    onPointsPlaced: PropTypes.func.isRequired,
};

export default InteractiveMap;