// Core Modules
import { Fragment } from 'react'
import { Badge, Box } from '@chakra-ui/react';

// API Modules
import { DeleteBlog } from '../../api/labs/DELETE.js';
import { useDatablogs, fetchBlogById } from '../../api/labs/GET.js'

// Context
import { useGlobalContext } from '../../contexts/GlobalContext.jsx';

// Component Modules
import Search from '../../components/Search.jsx';
import CustomTable from '../../components/Table.jsx';
import Pagination from '../../components/Pagination.jsx';
import CustomModal from '../../components/Modal.jsx';
import Loading from '../../components/Loading.jsx';


function BlogOverview({ token }) {

    // ** Global Context
    const { dataTable, setDataTable, pageNumber, searchParams,
        isOpen, onOpen, onClose, toast
    } = useGlobalContext();

    // ** React query api call
    const { data: blogs, isLoading, isError, refetch } = useDatablogs({ page: pageNumber, ...searchParams });

    if (isLoading) return <Loading />
    if (isError) return 'Error loading blogs';

    const ActionListTable = [
        {
            label: "Copy Content to Add Site",
            onClick: async (blog_id) => {
                try {
                    const blog_data = await fetchBlogById(blog_id);

                    const blog_by_id = blog_data.data[0];

                    // set this data to localstorage
                    window.localStorage.setItem('headerContent', JSON.stringify({
                        title: blog_by_id.title,
                        image: blog_by_id.image,
                        image_alt: blog_by_id.image_alt,
                        short_description: blog_by_id.short_description
                    }));
                    window.localStorage.setItem('content', blog_by_id.description);
                    window.localStorage.setItem('tags', JSON.stringify(blog_by_id.tags));

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
            onClick: async (blog_id) => {
                try {
                    const blog_data = await fetchBlogById(blog_id);
                    setDataTable(blog_data.data[0])
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
            onClick: async (blog_id) => {
                try {
                    await DeleteBlog(blog_id, token)
                    refetch();
                    toast({
                        title: `Successfully deleted Blog Data`,
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
    ];

    return (
        <Fragment>

            <CustomModal modalTitle="Blog Detail" modalSize="6xl" isOpen={isOpen} onClose={onClose}>
                {dataTable && (
                    <Fragment>
                        <Box mx="auto" w={{ base: "100%", lg: "70%" }}>
                            <Box mb={4} display="flex" flexWrap="wrap" gap={2}>
                                {dataTable.tags?.map((tag, i) => (
                                    <Badge key={i} colorScheme="blue">
                                        {tag}
                                    </Badge>
                                ))}
                            </Box>
                            <div className="content" dangerouslySetInnerHTML={{ __html: dataTable.description }} />
                        </Box>
                    </Fragment>
                )}
            </CustomModal>

            <Search searchKey={"title"} />

            <CustomTable ColumnNames={['Title', 'Created', "Blog ID", 'Actions']}
                RowsAttr={["title", "timestamp", "blog_id"]} Rows={blogs.data}
                KeyAction={"blog_id"} ActionList={ActionListTable} />

            <Pagination paginationData={blogs} />

        </Fragment >
    )
}

export default BlogOverview