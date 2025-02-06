// Core Modules
import { Fragment, useState } from 'react'
import { useToast, useDisclosure, Heading, Box, Button } from '@chakra-ui/react';

// Custom Components
import CustomTable from '../../components/Table';
import CustomModal from '../../components/Modal';

// API Modules
import { DeployPortfolio } from '../../api/webhook/portfolio';
import { useDataProjects } from '../../api/projects/GET';
import { DeleteProject } from '../../api/projects/DELETE';

// CSS
import '../../index.css'


function ProjectsOverview({ token }) {

    const { data: projects, isLoading, isError, refetch } = useDataProjects();

    const [projectData, setProjectData] = useState({});

    const { isOpen: isOpenProjectModal, onOpen: onOpenProjectModal, onClose: onCloseProjectModal } = useDisclosure();
    const toast = useToast();

    if (isLoading) return 'Loading...'
    if (isError) return 'Error loading projects'

    const ActionListTable = [
        {
            label: "Copy Content to Add Site",
            onClick: (project_id) => {
                try {
                    // ** get the project by id
                    let getProjectById = projects.find((project) => project.project_id === project_id)

                    // Store to localstorage
                    window.localStorage.setItem('headerContent-project', JSON.stringify({
                        heading: getProjectById.heading,
                        text: getProjectById.text,
                        image_url: getProjectById.imageUrl,
                        skills_url: getProjectById.skillsUrl
                    }))

                    window.localStorage.setItem('content-project', getProjectById.htmlContent)

                    // for image url list
                    if (1) {
                        // Use a regex to extract all src attributes
                        const regex = /<img\s+[^>]*src=["']([^"']+)["']/gi; // Global and case-insensitive

                        // Extract all matches using matchAll()
                        const matches = [...getProjectById.htmlImage.matchAll(regex)];

                        // Extract and log all src URLs
                        let imageUrl = [];
                        if (matches.length > 0) {
                            matches.forEach((match, index) => {
                                imageUrl.push(match[1]);
                            });
                        }

                        // Store to localstorage
                        window.localStorage.setItem('tempImageList-project', JSON.stringify(imageUrl))
                    }

                    // for temp image list
                    if (1) {
                        const regex = /<img[^>]*>/g;
                        // Match all <img> tags and store them in an array
                        const imgTagList = getProjectById.htmlImage.match(regex);
                        window.localStorage.setItem('imageUrl-project', JSON.stringify(imgTagList));
                    }

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
            }
        },
        {
            label: "Details",
            onClick: (project_id) => {
                try {
                    // ** get the project by id
                    let getProjectById = projects.find((project) => project.project_id === project_id)

                    // ** store to react state
                    setProjectData(getProjectById);
                    onOpenProjectModal()
                } catch (err) {
                    console.error(err)
                    toast({
                        title: `Something went wrong`,
                        status: "error",
                    })
                }
            }
        },
        {
            label: "Delete",
            onClick: async (project_id) => {
                try {
                    await DeleteProject(project_id, token)
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
                }
            }
        }
    ]

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


    return (
        <div>
            <CustomModal modalTitle='Project Detail' modalSize='3xl' isOpen={isOpenProjectModal} onClose={onCloseProjectModal} >
                <Fragment>
                    <Heading fontSize={{ lg: 'xxx-large', base: 'xx-large' }}>{projectData?.heading}</Heading>
                    <Heading fontSize={{ lg: 'x-large', base: 'large' }}>{projectData?.text}</Heading>
                    <Box >
                        <pre style={{
                            marginBottom: '10px', textAlign: 'justify', whiteSpace: 'pre-wrap',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica',
                        }}>
                            {projectData?.htmlContent}
                        </pre>
                    </Box>
                    <Heading my={5} >User Interface (UI)</Heading>
                    <Box id='image' dangerouslySetInnerHTML={{ __html: projectData?.htmlImage }}>
                    </Box>
                </Fragment>
            </CustomModal>
            <Button size={'sm'} onClick={handleDeployPortfolio} variant={'solid'} colorScheme={'green'}>
                Prefetch Portfolio Site
            </Button>
            <CustomTable ColumnNames={["Project ID", "Heading", "Text", "Action"]}
                Rows={projects} RowsAttr={["project_id", "heading", "text"]} KeyAction="project_id" ActionList={ActionListTable} />
        </div >
    )
}

export default ProjectsOverview