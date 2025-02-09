// Core Modules
import { Fragment, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
    useToast, useDisclosure, Heading, Box, Button,
    Flex, Spacer, Input, Text
} from '@chakra-ui/react';

// Custom Components
import CustomTable from '../../components/Table';
import CustomModal from '../../components/Modal';

// API Modules
import { useDataProjects } from '../../api/projects/GET';
import { DeleteProject } from '../../api/projects/DELETE';

// CSS
import '../../index.css'


function ProjectsOverview({ token }) {

    // ** internal state
    const [projectData, setProjectData] = useState({});
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParams, setSearchParams] = useState({
        heading: "",
    });

    const { data: projects, isLoading, isError, refetch } = useDataProjects(pageNumber, 8, searchParams.heading);

    const { isOpen: isOpenProjectModal, onOpen: onOpenProjectModal, onClose: onCloseProjectModal } = useDisclosure();
    const toast = useToast();

    if (isLoading) return 'Loading...'
    if (isError) return 'Error loading projects'

    const handleSearchQuery = (e) => {
        setPageNumber(1); // Reset to first page when searching
        setSearchParams({
            heading: e.target.title.value
        });
    };

    const ActionListTable = [
        {
            label: "Copy Content to Add Site",
            onClick: (project_id) => {
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
                    let getProjectById = projects.data.find((project) => project.project_id === project_id)

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


            <form onSubmit={handleSearchQuery}>
                <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                    <Spacer />
                    <Input width={{ base: '100%', lg: '25%' }} borderLeftRadius={'2xl'} borderRightRadius={0} size={'md'} borderWidth={3} colorScheme='purple' borderColor={"#536189"}
                        focusBorderColor={"#ff79c6"} placeholder='Search By heading...' name='title' />
                    <Button borderLeftRadius={0} size={'md'} colorScheme='purple'
                        type='submit'>
                        Search
                    </Button>
                </Flex>
            </form>

            <CustomTable ColumnNames={["Project ID", "Heading", "Text", "Action"]}
                Rows={projects.data} RowsAttr={["project_id", "heading", "text"]} KeyAction="project_id" ActionList={ActionListTable} />


            <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                <Spacer />
                <Button mr={4} colorScheme='purple' isDisabled={pageNumber === 1}
                    onClick={() => setPageNumber(prev => prev - 1)}><IoIosArrowBack /></Button>
                <Text>
                    Page {projects.current_page} of {projects.last_page}
                </Text>
                <Button ml={4} colorScheme='purple'
                    isDisabled={pageNumber === projects.last_page}
                    onClick={() => setPageNumber(prev => prev + 1)}><IoIosArrowForward /></Button>
            </Flex>

        </div >
    )
}

export default ProjectsOverview