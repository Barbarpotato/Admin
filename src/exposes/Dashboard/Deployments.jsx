// Core Modules
import React from 'react'
import {
    Tabs, TabList, TabPanels, Tab, TabPanel, Table, Button, useToast,
    Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer,
    MenuButton, Menu, MenuList, MenuItem
} from '@chakra-ui/react'

// Custom Components
import Loading from '../../components/Loading';

// API Modules
import { DeployPortfolio } from '../../api/webhook/portfolio.js';
import { DeployLabs } from '../../api/webhook/labs.js';
import { useDeploymentLabsStatus, useDeploymentPortfolioStatus } from '../../api/deployments/GET.js';
import { useDataIndex } from '../../api/labs/GET.js';

function Deployments({ token }) {

    const { data: labs, isLoading: labsIsLoading, isError: labsIsError } = useDeploymentLabsStatus(token);
    const { data: portfolio, isLoading: portfolioIsLoading, isError: portfolioIsError } = useDeploymentPortfolioStatus(token);
    const { data: index, isLoading: indexIsLoading, isError: indexIsError } = useDataIndex(token);

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

    const handleDeployLabs = async (index) => {
        try {
            await DeployPortfolio(token);
            await DeployLabs(token, index);
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

    if (labsIsLoading || portfolioIsLoading || indexIsLoading) return <Loading />

    return (
        <>
            <Tabs colorScheme='purple'>


                <TabList>
                    <Tab>Portfolio</Tab>
                    <Tab>Labs</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>

                        <Button my={5} size={{ base: 'xs', md: 'sm' }} onClick={handleDeployPortfolio} variant={'solid'} colorScheme={'green'}>
                            Prefetch Portfolio Site
                        </Button>

                        <TableContainer>
                            <Table fontSize={'sm'} variant='simple'>
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

                        <Menu >
                            <MenuButton my={5} size={{ base: 'xs', md: 'sm' }} as={Button} variant={'solid'} colorScheme={'green'}>
                                Deploy SSG Labs
                            </MenuButton>
                            <MenuList bg={"#292b37"}>
                                {
                                    index?.map((item, index) => (
                                        <MenuItem bg={"#292b37"} key={index} onClick={() => handleDeployLabs(item)}>
                                            Labs-{item}
                                        </MenuItem>
                                    ))
                                }
                            </MenuList>
                        </Menu>


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