// Core Modules
import { Fragment } from 'react'
import { Heading, Box } from '@chakra-ui/react';

// Context
import { useGlobalContext } from '../../contexts/GlobalContext';

// Custom Components
import Search from '../../components/Search';
import CustomTable from '../../components/Table';
import Pagination from '../../components/Pagination';
import CustomModal from '../../components/Modal';

// API Modules
import { useDataProjects } from '../../api/projects/GET';
import { DeleteProject } from '../../api/projects/DELETE';


function ProjectsOverview({ token }) {

    // ** Global Context 
    const { dataTable, setDataTable, pageNumber, searchParams,
        isOpen, onOpen, onClose, toast
    } = useGlobalContext();

    // ** React query api call
    const { data: projects, isLoading, isError, refetch } = useDataProjects(pageNumber, 8, searchParams.heading);

    if (isLoading) return 'Loading...'
    if (isError) return 'Error loading projects'

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
                    setDataTable(getProjectById);
                    onOpen()
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
        <Fragment>

            <CustomModal modalTitle='Project Detail' modalSize='3xl' isOpen={isOpen} onClose={onClose} >
                <Fragment>
                    <Heading fontSize={{ lg: 'xxx-large', base: 'xx-large' }}>{dataTable?.heading}</Heading>
                    <Heading fontSize={{ lg: 'x-large', base: 'large' }}>{dataTable?.text}</Heading>
                    <Box >
                        <pre style={{
                            marginBottom: '10px', textAlign: 'justify', whiteSpace: 'pre-wrap',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica',
                        }}>
                            {dataTable?.htmlContent}
                        </pre>
                    </Box>
                    <Heading my={5} >User Interface (UI)</Heading>
                    <Box id='image' dangerouslySetInnerHTML={{ __html: dataTable?.htmlImage }}>
                    </Box>
                </Fragment>
            </CustomModal>

            <Search searchKey='heading' />

            <CustomTable ColumnNames={["Heading", "Text", "Project ID", "Action"]}
                Rows={projects.data} RowsAttr={["heading", "text", "project_id"]} KeyAction="project_id" ActionList={ActionListTable} />

            <Pagination paginationData={projects} />

        </Fragment>
    )
}

export default ProjectsOverview