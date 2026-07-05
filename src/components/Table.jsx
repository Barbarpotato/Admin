import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

/**
 * CustomTable Component
 *
 * A flexible and reusable table component built with Chakra UI, designed to render dynamic data,
 * with an optional actions column for each row. This component supports customizable column headers and data rows.
 *
 * @param {Array} ColumnNames - Array of strings representing the column headers for the table.
 * @param {Array} Rows - Array of objects, where each object corresponds to a row in the table.
 *                          Each key-value pair in an object represents a column and its data.
 * @param {string} [KeyAction] - A key from the Rows objects that identifies each row uniquely.
 *                               Passed to `renderActions` for the row.
 * @param {Function} [renderActions] - Given the row's `KeyAction` value, returns the JSX to render
 *                                     in the last column (e.g. a row of action buttons).
 *
 * @returns {JSX.Element} A responsive table component with data and optional actions.
 *
 * @example
 * <CustomTable
 *   ColumnNames={['Name', 'Age', 'City']}
 *   Rows={[
 *     { name: 'John', age: 28, city: 'New York' },
 *     { name: 'Jane', age: 32, city: 'San Francisco' }
 *   ]}
 *   KeyAction="name"
 *   renderActions={(name) => <Button onClick={() => handleEdit(name)}>Edit</Button>}
 * />
 *
 * @note
 * - If `ColumnNames` or `Rows` are empty, a message indicating "No data found!" will be displayed.
 */
function CustomTable({ ColumnNames = [], RowsAttr = [], Rows = [], KeyAction = "", renderActions }) {

    if (ColumnNames.length == 0 || Rows.length == 0) return (
        <Text color={"red"}>No data found!</Text>
    )

    const [RowsState, setRowsState] = useState([]);

    useEffect(() => {
        // ** Clean up the the data Rows based on the RowsAttr pick
        if (RowsAttr.length > 0) {
            let filteredRows = Rows.map(row => {
                let filteredRow = {};
                Object.keys(row).forEach(key => {
                    if (RowsAttr.includes(key)) {
                        filteredRow[key] = row[key]
                    }
                })
                return filteredRow
            })

            // sort filtered rows based on the rowsattr
            filteredRows = filteredRows.map(row => {
                let sortedRow = {};
                RowsAttr.forEach(key => {
                    sortedRow[key] = row[key]
                })
                return sortedRow
            })

            setRowsState(filteredRows)
        }
        // ** If RowsAttr is empty, no filtering is applied
        else setRowsState(Rows)
    }, [RowsAttr, Rows])

    return (
        <TableContainer>
            <Table w={'100%'} overflowX={'scroll'} fontSize={'sm'} variant='simple' size={'md'}>
                <Thead>
                    <Tr>
                        {
                            ColumnNames.map((columnName, index) => (
                                <Th key={index}>{columnName}</Th>
                            ))
                        }
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        RowsState.map((row, index) => (
                            <Tr key={index}>
                                {
                                    Object.entries(row).map(([_key, value], index) => (
                                        <Td key={index}>{value}</Td>
                                    ))
                                }
                                {
                                    renderActions && <Td>{renderActions(row[KeyAction])}</Td>
                                }
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </TableContainer >
    )
}

export default CustomTable
