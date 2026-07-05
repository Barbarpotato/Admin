// Core Modules
import { Fragment, useRef, useState } from 'react'
import {
    Flex, IconButton, Button,
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay, useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiCopy, FiEye, FiTrash2 } from 'react-icons/fi';

// Context
import { useGlobalContext } from '../../contexts/GlobalContext';

// Custom Components
import Search from '../../components/Search';
import CustomTable from '../../components/Table';
import Pagination from '../../components/Pagination';

// API Modules
import { useDataProjects } from '../../api/projects/GET';
import { DeleteProject } from '../../api/projects/DELETE';


function ProjectsOverview({ token }) {

    const { pageNumber, searchParams, toast } = useGlobalContext();
    const navigate = useNavigate();

    // ** React query api call
    const { data: projects, isLoading, isError, refetch } = useDataProjects(pageNumber, 8, searchParams.heading);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelDeleteRef = useRef(null);

    if (isLoading) return 'Loading...'
    if (isError) return 'Error loading projects'

    const handleCopy = (project_id) => {
        try {
            // ** get the project by id
            let getProjectById = projects.data.find((project) => project.project_id === project_id)

            // Store to localstorage
            window.localStorage.setItem('headerContent-project', JSON.stringify({
                heading: getProjectById.heading,
                text: getProjectById.text,
                image_url: getProjectById.imageUrl,
                skills_url: getProjectById.skillsUrl
            }))

            window.localStorage.setItem('content-project', getProjectById.htmlContent)

            // Use a regex to extract all src attributes
            const imgSrcRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi;
            const matches = [...getProjectById.htmlImage.matchAll(imgSrcRegex)];
            const imageUrl = matches.map((match) => match[1]);
            window.localStorage.setItem('tempImageList-project', JSON.stringify(imageUrl))

            // Match all <img> tags and store them in an array
            const imgTagRegex = /<img[^>]*>/g;
            const imgTagList = getProjectById.htmlImage.match(imgTagRegex);
            window.localStorage.setItem('imageUrl-project', JSON.stringify(imgTagList));

            toast({
                title: `Copy Content to Add Site`,
                status: "success",
            })
        } catch (err) {
            console.error(err)
            toast({
                title: `Something went wrong`,
                status: "error",
            })
        }
    };

    const handleDetails = (project_id) => {
        try {
            const project = projects.data.find((p) => p.project_id === project_id);
            navigate('/ProjectDetail', { state: { project } });
        } catch (err) {
            console.error(err)
            toast({
                title: `Something went wrong`,
                status: "error",
            })
        }
    };

    const requestDelete = (project_id) => {
        setDeleteTarget(project_id);
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await DeleteProject(deleteTarget, token)
            refetch();
            toast({
                title: `Successfully deleted Project Data`,
                status: "success",
            })
        } catch (err) {
            console.error(err)
            toast({
                title: `Something went wrong`,
                status: "error",
            })
        } finally {
            setDeleteTarget(null);
            onDeleteClose();
        }
    };

    return (
        <Fragment>

            <Search searchKey='heading' />

            <CustomTable
                ColumnNames={["Heading", "Text", "Project ID", "Action"]}
                Rows={projects.data} RowsAttr={["heading", "text", "project_id"]} KeyAction="project_id"
                renderActions={(project_id) => (
                    <Flex gap={1}>
                        <IconButton
                            aria-label="Copy content to Add Site" icon={<FiCopy />}
                            size="sm" variant="ghost" color={'#866bab'} _hover={{ color: '#cc7bc9', bg: 'rgba(134, 107, 171, 0.15)' }}
                            onClick={() => handleCopy(project_id)}
                        />
                        <IconButton
                            aria-label="View details" icon={<FiEye />}
                            size="sm" variant="ghost" color={'#866bab'} _hover={{ color: '#cc7bc9', bg: 'rgba(134, 107, 171, 0.15)' }}
                            onClick={() => handleDetails(project_id)}
                        />
                        <IconButton
                            aria-label="Delete project" icon={<FiTrash2 />}
                            size="sm" variant="ghost" colorScheme="red"
                            onClick={() => requestDelete(project_id)}
                        />
                    </Flex>
                )}
            />

            <Pagination paginationData={projects} />

            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelDeleteRef} onClose={onDeleteClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent bg={'#383a4a'} color={'#faf9ff'}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete project</AlertDialogHeader>

                        <AlertDialogBody color={'#c0c0c0'}>
                            Are you sure you want to delete this project? This cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelDeleteRef} onClick={onDeleteClose} variant={'ghost'} color={'#c0c0c0'}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Fragment>
    )
}

export default ProjectsOverview
