// Core Modules
import React from 'react'
import {
    Tabs, TabList, TabPanels, Tab, TabPanel, Table, Button, useToast,
    Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer,
} from '@chakra-ui/react'

// Custom Components
import Loading from '../../components/Loading';

// API Modules
import { DeployPortfolio } from '../../api/webhook/portfolio.js';
import { DeployLabs } from '../../api/webhook/labs.js';
import { useDeploymentLabsStatus, useDeploymentPortfolioStatus } from '../../api/deployments/GET.js';

function Deployments({ token }) {

    const { data: labs, isLoading: labsIsLoading, isError: labsIsError } = useDeploymentLabsStatus(token);
    const { data: portfolio, isLoading: portfolioIsLoading, isError: portfolioIsError } = useDeploymentPortfolioStatus(token);

    // ** chakra staff
    const toast = useToast();

    const handleDeployPortfolio = async () => {
        try {
            await DeployPortfolio(token);
            toast({
                title: `Prefetching In Progress`,
                status: "success",
            })
        } catch (err) {
            console.error(err)
            toast({
                title: `Something went wrong`,
                status: "error",
            })
        }
    }

    const handleDeployLabs = async () => {
        try {
            await DeployPortfolio(token);
            await DeployLabs(token);
            toast({
                title: `Deployment In Progress`,
                status: "success",
            })
        } catch (err) {
            console.error(err)
            toast({
                title: `Something went wrong`,
                status: "error",
            })
        }
    }

    if (labsIsLoading || portfolioIsLoading) return <Loading />


    return (
        <>
            <Tabs colorScheme='purple'>


                <TabList>
                    <Tab>Portfolio</Tab>
                    <Tab>Labs</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>

                        <Button my={5} onClick={handleDeployPortfolio} variant={'solid'} colorScheme={'green'}>
                            Prefetch Portfolio Site
                        </Button>

                        <TableContainer>
                            <Table variant='simple'>
                                <TableCaption>Portfolio Deployment Logs</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Created At</Th>
                                        <Th>Updated At</Th>
                                        <Th>Event</Th>
                                        <Th>Status</Th>
                                        <Th>Conclusion</Th>
                                        <Th>URL</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>

                                    {
                                        portfolio?.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{item.created_at}</Td>
                                                <Td>{item.updated_at}</Td>
                                                <Td>{item.event}</Td>
                                                <Td>{item.status}</Td>
                                                <Td style={{ color: item.conclusion === "success" ? "green" : "red" }}>
                                                    {item.conclusion}
                                                </Td>
                                                <Td><a style={{ textDecoration: "underline" }} href={item.html_url} target="_blank">Link</a></Td>
                                            </Tr>
                                        ))
                                    }

                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel>

                        <Button my={5} onClick={handleDeployLabs} variant={'solid'} colorScheme={'green'}>Deploy SSG Labs</Button>


                        <TableContainer>
                            <Table variant='simple'>
                                <TableCaption>Labs Deployment Logs</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Created At</Th>
                                        <Th>Updated At</Th>
                                        <Th>Event</Th>
                                        <Th>Status</Th>
                                        <Th>Conclusion</Th>
                                        <Th>URL</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>

                                    {
                                        labs?.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{item.created_at}</Td>
                                                <Td>{item.updated_at}</Td>
                                                <Td>{item.event}</Td>
                                                <Td>{item.status}</Td>
                                                <Td style={{ color: item.conclusion === "success" ? "green" : "red" }}>
                                                    {item.conclusion}
                                                </Td>
                                                <Td><a style={{ textDecoration: "underline" }} href={item.html_url} target="_blank">Link</a></Td>
                                            </Tr>
                                        ))
                                    }

                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                </TabPanels>
            </Tabs ></>
    )
}

export default Deployments