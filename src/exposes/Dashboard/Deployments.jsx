import {
    Heading, Button, useToast, Menu, MenuButton, MenuList, MenuItem, Flex, Box, Text,
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay, useDisclosure
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiFolder, FiFileText, FiGlobe, FiCpu } from 'react-icons/fi';

import Loading from '../../components/Loading';
import SectionCard from '../../components/SectionCard';
import ActivityHeatmap from '../../components/ActivityHeatmap';
import { DeployPortfolio } from '../../api/webhook/portfolio.js';
import { DeployLabs } from '../../api/webhook/labs.js';
import { DeployProjects } from '../../api/webhook/project.js';
import { useDataIndex, useDatablogs } from '../../api/labs/GET.js';
import { useDataProjects } from '../../api/projects/GET.js';

const buttonStyle = { bg: '#866bab', color: '#faf9ff', _hover: { bg: '#cc7bc9' } };

function StatTile({ label, value, icon }) {
    return (
        <Box bg={'#383a4a'} borderRadius={'xl'} boxShadow={'md'} p={5} flex={1} minW={'140px'}>
            <Flex align={'center'} gap={2} mb={1}>
                <Box color={'#cc7bc9'} fontSize={'lg'} aria-hidden="true">{icon}</Box>
                <Text fontSize={'sm'} color={'#c0c0c0'}>{label}</Text>
            </Flex>
            <Heading size={'lg'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#cc7bc9'}>{value}</Heading>
        </Box>
    );
}

function Deployments({ token }) {
    const { data: index, isLoading: indexIsLoading } = useDataIndex();

    // ** total projects: minimal fetch just to read the total off the response
    const { data: projectsMeta } = useDataProjects(1, 1);

    // ** blogs: fetched in bulk so the same response also feeds the activity heatmap
    const { data: blogsMeta } = useDatablogs({ page: 1, per_page: 100 });

    const toast = useToast();

    // ** pending deploy action, confirmed via the alert dialog before it actually runs
    const [pendingAction, setPendingAction] = useState(null); // { type: 'portfolio' | 'projects' | 'labs', index? }
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const cancelDeployRef = useRef(null);

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

    const handleDeployLabs = async (labsIndex) => {
        try {
            await DeployLabs(token, labsIndex);
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

    const requestDeploy = (action) => {
        setPendingAction(action);
        onConfirmOpen();
    };

    const handleConfirmDeploy = async () => {
        if (pendingAction?.type === 'portfolio') await handleDeployPortfolio();
        if (pendingAction?.type === 'projects') await handleDeployProjects();
        if (pendingAction?.type === 'labs') await handleDeployLabs(pendingAction.index);

        setPendingAction(null);
        onConfirmClose();
    };

    if (indexIsLoading) return <Loading />;

    const totalProjects = projectsMeta?.total_projects ?? projectsMeta?.total ?? projectsMeta?.data?.length ?? 0;
    const totalBlogs = blogsMeta?.total_blogs ?? 0;

    const activityDates = (blogsMeta?.data ?? []).map((blog) => blog.timestamp).filter(Boolean);

    const confirmMessage = pendingAction?.type === 'portfolio'
        ? 'Trigger a fresh prefetch of the Portfolio site?'
        : pendingAction?.type === 'projects'
            ? 'Trigger a deployment for the Projects site?'
            : pendingAction?.type === 'labs'
                ? `Deploy SSG for "Labs-${pendingAction.index}"?`
                : '';

    return (
        <>
            <Heading size={'lg'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={700} color={'#faf9ff'} mb={6}>
                Dashboard
            </Heading>

            <Flex gap={4} mb={6} wrap={'wrap'}>
                <StatTile label='Total Projects' value={totalProjects} icon={<FiFolder />} />
                <StatTile label='Total Blogs' value={totalBlogs} icon={<FiFileText />} />
            </Flex>

            <SectionCard title='Blog Activity' description='Days with a published or updated blog post, over the last ~4 months' icon={<FiFileText />}>
                <ActivityHeatmap dates={activityDates} />
            </SectionCard>

            <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={'stretch'}>
                <SectionCard title='Portfolio' description='Trigger a fresh prefetch of the portfolio site' icon={<FiGlobe />} flex={1} mb={0}>
                    <Button size={{ base: 'xs', md: 'sm' }} onClick={() => requestDeploy({ type: 'portfolio' })} {...buttonStyle}>
                        Prefetch Portfolio Site
                    </Button>
                </SectionCard>

                <SectionCard title='Labs' description='Pick a labs index to deploy' icon={<FiCpu />} flex={1} mb={0}>
                    <Menu>
                        <MenuButton size={{ base: 'xs', md: 'sm' }} as={Button} {...buttonStyle}>
                            Deploy SSG Labs
                        </MenuButton>
                        <MenuList bg={"#292b37"}>
                            {index?.map((item, idx) => (
                                <MenuItem
                                    bg={"#292b37"}
                                    key={idx}
                                    onClick={() => requestDeploy({ type: 'labs', index: item })}
                                >
                                    Labs-{item}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </SectionCard>

                <SectionCard title='Projects' description='Trigger a deployment for the projects site' icon={<FiFolder />} flex={1} mb={0}>
                    <Button size={{ base: 'xs', md: 'sm' }} onClick={() => requestDeploy({ type: 'projects' })} {...buttonStyle}>
                        Deploy Projects
                    </Button>
                </SectionCard>
            </Flex>

            <AlertDialog isOpen={isConfirmOpen} leastDestructiveRef={cancelDeployRef} onClose={onConfirmClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent bg={'#383a4a'} color={'#faf9ff'}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">Confirm deployment</AlertDialogHeader>

                        <AlertDialogBody color={'#c0c0c0'}>
                            {confirmMessage}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelDeployRef} onClick={onConfirmClose} variant={'ghost'} color={'#c0c0c0'}>
                                Cancel
                            </Button>
                            <Button {...buttonStyle} onClick={handleConfirmDeploy} ml={3}>
                                Deploy
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default Deployments;
