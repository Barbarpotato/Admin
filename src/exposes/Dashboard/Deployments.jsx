import React from 'react';
import {
    Tabs, TabList, TabPanels, Tab, TabPanel, Table, Button, useToast,
    Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer,
    MenuButton, Menu, MenuList, MenuItem
} from '@chakra-ui/react';

import Loading from '../../components/Loading';
import { DeployPortfolio } from '../../api/webhook/portfolio.js';
import { DeployLabs } from '../../api/webhook/labs.js';
import { DeployProjects } from '../../api/webhook/project.js';
import { useDeploymentLabsStatus, useDeploymentPortfolioStatus, useDeploymentProjectsStatus } from '../../api/deployments/GET.js';
import { useDataIndex } from '../../api/labs/GET.js';

function Deployments({ token }) {
    const [selectedLabsIndex, setSelectedLabsIndex] = React.useState("6b86b273ff34f"); // State for selected index

    // API hooks
    const { data: labs, isLoading: labsIsLoading, isError: labsIsError } = useDeploymentLabsStatus(token, selectedLabsIndex);
    const { data: portfolio, isLoading: portfolioIsLoading, isError: portfolioIsError } = useDeploymentPortfolioStatus(token);
    const { data: projects, isLoading: projectsIsLoading, isError: projectsIsError } = useDeploymentProjectsStatus(token);
    const { data: index, isLoading: indexIsLoading, isError: indexIsError } = useDataIndex(token);

    // Chakra toast notifications
    const toast = useToast();

    // Deploy functions
    const handleDeployPortfolio = async () => {
        try {
            await DeployPortfolio(token);
            toast({
                title: `Prefetching In Progress`,
                status: "success",
            });
        } catch (err) {
            console.error(err);
            toast({
                title: `Something went wrong`,
                status: "error",
            });
        }
    };

    const handleDeployLabs = async (index) => {
        try {
            await DeployLabs(token, index);
            toast({
                title: `Deployment In Progress`,
                status: "success",
            });
        } catch (err) {
            console.error(err);
            toast({
                title: `Something went wrong`,
                status: "error",
            });
        }
    };

    const handleDeployProjects = async () => {
        try {
            await DeployProjects(token);
            toast({
                title: `Deployment In Progress`,
                status: "success",
            });
        } catch (err) {
            console.error(err);
            toast({
                title: `Something went wrong`,
                status: "error",
            });
        }
    };

    // Loading state
    if (labsIsLoading || portfolioIsLoading || projectsIsLoading || indexIsLoading) return <Loading />;

    return (
        <>
            <Tabs colorScheme='purple'>
                <TabList>
                    <Tab>Portfolio</Tab>
                    <Tab>Labs</Tab>
                    <Tab>Projects</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Button
                            my={5}
                            size={{ base: 'xs', md: 'sm' }}
                            onClick={handleDeployPortfolio}
                            variant={'solid'}
                            colorScheme={'green'}
                        >
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
                                    {portfolio?.map((item, idx) => (
                                        <Tr key={idx}>
                                            <Td>{item.created_at}</Td>
                                            <Td>{item.updated_at}</Td>
                                            <Td>{item.event}</Td>
                                            <Td>{item.status}</Td>
                                            <Td style={{ color: item.conclusion === "success" ? "green" : "red" }}>
                                                {item.conclusion}
                                            </Td>
                                            <Td>
                                                <a style={{ textDecoration: "underline" }} href={item.html_url} target="_blank" rel="noopener noreferrer">
                                                    Link
                                                </a>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                    <TabPanel>
                        {/* New dropdown to select Labs index */}
                        <Menu>
                            <MenuButton
                                my={5}
                                size={{ base: 'xs', md: 'sm' }}
                                as={Button}
                                variant={'solid'}
                                colorScheme={'dark'}
                            >
                                Select Labs Index
                            </MenuButton>
                            <MenuList bg={"#292b37"}>
                                {index?.map((item, idx) => (
                                    <MenuItem
                                        bg={"#292b37"}
                                        key={idx}
                                        onClick={() => {
                                            setSelectedLabsIndex(item); // Update selectedLabsIndex
                                            // Trigger the fetch for the new selected index
                                        }}
                                    >
                                        Labs-{item}
                                    </MenuItem>
                                ))}
                            </MenuList>

                            {/* Existing dropdown for deploying Labs */}
                            <Menu>
                                <MenuButton
                                    my={5}
                                    ml={"auto"}
                                    size={{ base: 'xs', md: 'sm' }}
                                    as={Button}
                                    variant={'solid'}
                                    colorScheme={'green'}
                                >
                                    Deploy SSG Labs
                                </MenuButton>
                                <MenuList bg={"#292b37"}>
                                    {index?.map((item, idx) => (
                                        <MenuItem
                                            bg={"#292b37"}
                                            key={idx}
                                            onClick={() => {
                                                setSelectedLabsIndex(item); // Set selected index
                                                handleDeployLabs(item); // Deploy Labs with selected index
                                            }}
                                        >
                                            Labs-{item}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>

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
                                    {labs?.map((item, idx) => (
                                        <Tr key={idx}>
                                            <Td>{item.created_at}</Td>
                                            <Td>{item.updated_at}</Td>
                                            <Td>{item.event}</Td>
                                            <Td>{item.status}</Td>
                                            <Td style={{ color: item.conclusion === "success" ? "green" : "red" }}>
                                                {item.conclusion}
                                            </Td>
                                            <Td>
                                                <a style={{ textDecoration: "underline" }} href={item.html_url} target="_blank" rel="noopener noreferrer">
                                                    Link
                                                </a>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                    <TabPanel>
                        <Button
                            my={5}
                            size={{ base: 'xs', md: 'sm' }}
                            onClick={handleDeployProjects}
                            variant={'solid'}
                            colorScheme={'green'}
                        >
                            Deploy Projects
                        </Button>

                        <TableContainer>
                            <Table fontSize={'sm'} variant='simple'>
                                <TableCaption>Projects Deployment Logs</TableCaption>
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
                                    {projects?.map((item, idx) => (
                                        <Tr key={idx}>
                                            <Td>{item.created_at}</Td>
                                            <Td>{item.updated_at}</Td>
                                            <Td>{item.event}</Td>
                                            <Td>{item.status}</Td>
                                            <Td style={{ color: item.conclusion === "success" ? "green" : "red" }}>
                                                {item.conclusion}
                                            </Td>
                                            <Td>
                                                <a style={{ textDecoration: "underline" }} href={item.html_url} target="_blank" rel="noopener noreferrer">
                                                    Link
                                                </a>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
}

export default Deployments;
