// Core Modules
import React from 'react'
import {
    Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Table,
    Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Text
} from '@chakra-ui/react'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'

// API Modules
import { useDataMetrics, useDataLogs } from '../../api/metrics/GET';

// Custom Components
import Loading from '../../components/Loading';


function Metrics({ token }) {

    const { data: metrics, isLoading, isError } = useDataMetrics(token);

    const { data: logs, isLoading: isLoadingLogs, isError: isErrorLogs } = useDataLogs(token);

    if (isLoading || isLoadingLogs) return <Loading />;
    if (isError || isErrorLogs) return <p>Error fetching data.</p>;

    return (
        <Box width={"100%"}>

            <Tabs colorScheme='purple'>
                <TabList>
                    <Tab>Metrics [30 Days]</Tab>
                    <Tab>Logs [30 Days]</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box overflowX={"scroll"}>
                            <Heading fontSize={{ base: 'xl', xl: '2xl' }} my={10}>Verify Metrics [30 Days]</Heading>
                            <LineChart width={2000} height={300} data={metrics?.verify}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="method" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="hits" stroke="#3674B5" />
                                <Line type="monotone" dataKey="errors" stroke="#B82132" />
                            </LineChart>
                        </Box>


                        <Box overflowX={"scroll"}>
                            <Heading fontSize={{ base: 'xl', xl: '2xl' }} my={10}>Labs Metrics [30 Days]</Heading>
                            <LineChart width={2000} height={300} data={metrics.labs}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="method" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="hits" stroke="#3674B5" />
                                <Line type="monotone" dataKey="errors" stroke="#B82132" />
                            </LineChart>
                        </Box>

                        <Box overflowX={"scroll"}>
                            <Heading fontSize={{ base: 'xl', xl: '2xl' }} my={10}>Projects Metrics [30 Days]</Heading>
                            <LineChart width={2000} height={300} data={metrics.projects}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="method" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="hits" stroke="#3674B5" />
                                <Line type="monotone" dataKey="errors" stroke="#B82132" />
                            </LineChart>
                        </Box>

                        <Box overflowX={"scroll"}>
                            <Heading fontSize={{ base: 'xl', xl: '2xl' }} my={10}>Badges Metrics [30 Days]</Heading>
                            <LineChart width={2000} height={300} data={metrics.badges}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="method" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="hits" stroke="#3674B5" />
                                <Line type="monotone" dataKey="errors" stroke="#B82132" />
                            </LineChart>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        {logs.length > 0 ? (

                            <TableContainer>
                                <Table variant='simple'>
                                    <TableCaption>Metric Logs Based on 30 Days</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th width={"30%"}>Time</Th>
                                            <Th>Message</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {logs.map((log) => (
                                            <Tr key={log.id}>
                                                <Td width={"30%"}>{log.time}</Td>
                                                <Td>{log.message}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Text textAlign={"center"} color={"red.500"}>No logs found!</Text>
                        )}
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Box >
    )
}

export default Metrics