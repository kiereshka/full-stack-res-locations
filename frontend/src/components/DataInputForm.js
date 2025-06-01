import React, { useState, useMemo } from 'react';
import { useReactTable, flexRender } from '@tanstack/react-table';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DataInputForm = ({ m, n, onSubmit }) => {
    // Створюємо колонки для вартості та потужності
    const columns = useMemo(() => {
        const cols = [];
        for (let j = 0; j < n; j++) {
            cols.push({
                header: `Cost ${j + 1}`,
                accessorKey: `cost${j}`,
                cell: ({ row, column }) => (
                    <input
                        type="number"
                        value={row.original[column.id] || ''}
                        onChange={(e) => handleCellChange(row.index, column.id, e.target.value)}
                        min="0"
                        className="form-control"
                    />
                ),
            });
            cols.push({
                header: `Capacity ${j + 1}`,
                accessorKey: `capacity${j}`,
                cell: ({ row, column }) => (
                    <input
                        type="number"
                        value={row.original[column.id] || ''}
                        onChange={(e) => handleCellChange(row.index, column.id, e.target.value)}
                        min="0"
                        className="form-control"
                    />
                ),
            });
        }
        return cols;
    }, [n]);

    // Ініціалізація даних таблиці
    const [tableData, setTableData] = useState(
        Array.from({ length: m }, () => {
            const row = {};
            for (let j = 0; j < n; j++) {
                row[`cost${j}`] = 0;
                row[`capacity${j}`] = 0;
            }
            return row;
        })
    );

    // Обробка зміни значення в комірці
    const handleCellChange = (rowIndex, columnId, value) => {
        const parsedValue = value === '' ? 0 : parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue < 0) {
            alert('Будь ласка, введіть коректне невід’ємне ціле число.');
            return;
        }
        const newData = [...tableData];
        newData[rowIndex][columnId] = parsedValue;
        setTableData(newData);
    };

    // Обробка відправки форми
    const handleSubmit = () => {
        const isValid = tableData.every((row) =>
            Object.values(row).every((val) => !isNaN(val) && val >= 0)
        );
        if (isValid) {
            const data = tableData.map((row) => ({
                costs: Array.from({ length: n }, (_, j) => row[`cost${j}`]),
                capacities: Array.from({ length: n }, (_, j) => row[`capacity${j}`]),
            }));
            onSubmit(data);
        } else {
            alert('Будь ласка, заповніть усі поля коректними невід’ємними числами.');
        }
    };

    // Ініціалізація таблиці
    const table = useReactTable({
        data: tableData,
        columns,
        // У версії 8 не потрібно явно викликати getCoreRowModel
    });

    return (
        <div className="container mt-4">
            <h3>Введення даних</h3>
            <table className="table table-bordered">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <Button onClick={handleSubmit}>Надіслати дані</Button>
        </div>
    );
};

DataInputForm.propTypes = {
    m: PropTypes.number.isRequired,
    n: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default DataInputForm;