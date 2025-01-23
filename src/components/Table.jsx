import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import CustomMenu from './Menu'

/**
 * CustomTable Component
 * 
 * A flexible and reusable table component built with Chakra UI, designed to render dynamic data, 
 * with optional actions for each row. This component supports customizable column headers and data rows.
 *
 * @param {Array} ColumnNames - Array of strings representing the column headers for the table.
 * @param {Array} Rows - Array of objects, where each object corresponds to a row in the table.
 *                          Each key-value pair in an object represents a column and its data.
 * @param {string} [KeyAction] - A key from the Rows objects that identifies each row uniquely. 
 *                               Used to associate actions from the `ActionList`.
 * @param {Array} [ActionList] - Array of action items to be rendered in the last column of each row.
 *                               If provided, an extra column with a dropdown menu for actions will appear.
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
 *   ActionList={['Edit', 'Delete']}
 * />
 *
 * @note
 * - If `ColumnNames` or `Rows` are empty, a message indicating "No data found!" will be displayed.
 * - If `KeyAction` is not provided but `ActionList` contains items, an error message indicating "Invalid parameters Action!" will be displayed.
 */
function CustomTable({ ColumnNames = [], RowsAttr = [], Rows = [], KeyAction = "", ActionList = [] }) {

    if (ColumnNames.length == 0 || Rows.length == 0) return (
        <Text color={"red"}>No data found!</Text>
    )

    if (!KeyAction && ActionList.length > 0) return (
        <Text color={"red"}>Invalid parameters Action!</Text>
    )

    const [RowsState, setRowsState] = useState([]);

    useEffect(() => {
        // ** Clean up the the data Rows based on the RowsAttr pick
        if (RowsAttr.length > 0) {
            const filteredRows = Rows.map(row => {
                let filteredRow = {};
                Object.keys(row).forEach(key => {
                    if (RowsAttr.includes(key)) {
                        filteredRow[key] = row[key]
                    }
                })
                return filteredRow
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
                                    ActionList.length > 0 && <Td><CustomMenu MenuItemList={ActionList} KeyAction={row[KeyAction]} /></Td>
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