import React, { useState, useMemo } from 'react';
import { useReactTable, flexRender } from '@tanstack/react-table';
import { Table, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DataInputForm = ({ m, n, onSubmit }) => {
    const columns = useMemo(() => {
        const cols = [];
        for (let j = 0; j < n; j++) {
            cols.push({
                header: `Cost ${j + 1}`,
                accessorKey: `cost${j}`,
                cell: ({ row, column }) => (
                    <Form.Control
                        type="number"
                        value={row.original[column.id] || ''}
                        onChange={(e) => handleCellChange(row.index, column.id, e.target.value)}
                        min="0"
                        required
                    />
                ),
            });
            cols.push({
                header: `Capacity ${j + 1}`,
                accessorKey: `capacity${j}`,
                cell: ({ row, column }) => (
                    <Form.Control
                        type="number"
                        value={row.original[column.id] || ''}
                        onChange={(e) => handleCellChange(row.index, column.id, e.target.value)}
                        min="0"
                        required
                    />
                ),
            });
        }
        return cols;
    }, [n]);

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

    const handleSubmit = () => {
        const isValid = tableData.every((row, rowIndex) =>
            Object.entries(row).every(([key, val], colIndex) => {
                if (isNaN(val) || val < 0) {
                    alert(`Некоректне значення для локації ${rowIndex + 1}, ${key.startsWith('cost') ? 'вартість' : 'потужність'} ${Math.floor(colIndex / 2) + 1}`);
                    return false;
                }
                return true;
            })
        );
        if (isValid) {
            const data = tableData.map((row) => ({
                costs: Array.from({ length: n }, (_, j) => Number(row[`cost${j}`])),
                capacities: Array.from({ length: n }, (_, j) => Number(row[`capacity${j}`])),
            }));
            onSubmit(data);
        }
    };

    const table = useReactTable({
        data: tableData,
        columns,
    });

    return (
        <div className="container mt-4">
            <h3>Введення даних</h3>
            <Table bordered className="table">
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
            </Table>
            <Button onClick={handleSubmit} variant="primary" className="mt-2">
                Надіслати дані
            </Button>
        </div>
    );
};

DataInputForm.propTypes = {
    m: PropTypes.number.isRequired,
    n: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default DataInputForm;