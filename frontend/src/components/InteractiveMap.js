import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './InteractiveMap.css';

const InteractiveMap = ({ onPointsPlaced, initialPoints = [] }) => {
    const [points, setPoints] = useState(initialPoints);
    const [scale, setScale] = useState(100);
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const isInteractingRef = useRef(false);
    const [transform, setTransform] = useState({ scale: 1, positionX: 0, positionY: 0 });

    const canvasSize = 1000;
    const scaleFactor = canvasSize / scale;

    const handleClick = (e) => {
        if (e.detail !== 1 || isInteractingRef.current || e.target.closest('circle')) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const realX = (offsetX - transform.positionX) / transform.scale;
        const realY = (offsetY - transform.positionY) / transform.scale;

        const newX = Math.floor(realX / scaleFactor);
        const newY = Math.floor(realY / scaleFactor);

        if (
            newX >= 0 &&
            newX <= scale &&
            newY >= 0 &&
            newY <= scale &&
            !points.some(p => p.x === newX && p.y === newY)
        ) {
            setPoints(prev => [...prev, { x: newX, y: newY }]);
        }
    };

    const handlePointRemove = (index) => {
        setPoints(prev => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    };

    const handleScaleIncrease = () => setScale(s => Math.min(s + 10, 500));
    const handleScaleDecrease = () => setScale(s => Math.max(s - 10, 10));
    const handleDone = () => {
        if (points.length === 0) {
            alert("Будь ласка, додайте хоча б одну точку");
            return;
        }
        onPointsPlaced(points);
    };

    const tickStep = scale <= 20 ? 1 : scale <= 100 ? 10 : 50;
    const ticks = Array.from(
        { length: Math.floor(scale / tickStep) + 1 },
        (_, i) => i * tickStep
    );

    return (
        <div className="container-fluid mt-4" style={{ height: '100%' }}>
            <h2>Оберіть локації на площині</h2>
            <div className="mb-3">
                Масштаб:
                <button className="btn btn-secondary btn-sm mx-2" onClick={handleScaleDecrease}>−</button>
                <strong>{scale}</strong>
                <button className="btn btn-secondary btn-sm mx-2" onClick={handleScaleIncrease}>+</button>
            </div>

            <div
                style={{
                    border: '1px solid #ccc',
                    width: '100%',
                    maxHeight: '80vh',
                    aspectRatio: '1 / 1',
                    margin: '0 auto',
                }}
            >
                <TransformWrapper
                    doubleClick={{ disabled: true }}
                    onPanning={() => { isInteractingRef.current = true; }}
                    onPanningStop={({ state }) => {
                        isInteractingRef.current = false;
                        setTransform(state);
                    }}
                    onZoom={() => { isInteractingRef.current = true; }}
                    onZoomStop={({ state }) => {
                        isInteractingRef.current = false;
                        setTransform(state);
                    }}
                >
                    <TransformComponent
                        wrapperStyle={{ width: '100%', height: '100%' }}
                        contentStyle={{ width: '100%', height: '100%' }}
                    >
                        <svg
                            ref={canvasRef}
                            width="100%"
                            height="100%"
                            viewBox={`0 0 ${canvasSize} ${canvasSize}`}
                            onClick={handleClick}
                            style={{ background: '#fff', touchAction: 'none', display: 'block' }}
                        >
                            {ticks.map(t => {
                                const pos = t * scaleFactor;
                                const xPos = t * scaleFactor;
                                return (
                                    <g key={t}>
                                        <line x1={0} y1={pos} x2={canvasSize} y2={pos} stroke="#eee" strokeWidth={1} />
                                        <text x={2} y={pos - 2} fontSize={10} fill="#555">{t}</text>
                                        <line x1={xPos} y1={0} x2={xPos} y2={canvasSize} stroke="#eee" strokeWidth={1} />
                                        <text x={xPos + 2} y={12} fontSize={10} fill="#555">{t}</text>
                                    </g>
                                );
                            })}

                            {points.map((p, i) => {
                                const cx = p.x * scaleFactor;
                                const cy = p.y * scaleFactor;
                                return (
                                    <g key={`${p.x}-${p.y}`}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={5}
                                            fill="blue"
                                            stroke="black"
                                            strokeWidth={1}
                                            onDoubleClick={(e) => {
                                                e.stopPropagation();
                                                handlePointRemove(i);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <text x={cx + 6} y={cy - 6} fontSize={12} fill="#000">
                                            ({p.x}, {p.y})
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </TransformComponent>
                </TransformWrapper>
            </div>

            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleDone}>
                    Продовжити
                </button>
            </div>
        </div>
    );
};

InteractiveMap.propTypes = {
    onPointsPlaced: PropTypes.func.isRequired,
    initialPoints: PropTypes.array,
};

export default InteractiveMap;
