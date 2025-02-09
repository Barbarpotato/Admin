// Core Modules
import React, { Fragment, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useToast, useDisclosure, Button, Flex, Box, Text, Spacer, Input } from '@chakra-ui/react';

// API Modules
import { DeleteBlog } from '../../api/labs/DELETE.js';
import { useDatablogs, fetchBlogById } from '../../api/labs/GET.js'

// Component Modules
import CustomTable from '../../components/Table.jsx';
import CustomModal from '../../components/Modal.jsx';
import Loading from '../../components/Loading.jsx';

//
import "../../index.css"

function BlogOverview({ token }) {

    // ** internal state
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParams, setSearchParams] = useState({
        title: "",
        slug: "",
        blog_id: "",
    });

    const [blog, setBlog] = useState({});

    // ** react query api call
    const { data: blogs, isLoading, isError, refetch } = useDatablogs({ page: pageNumber, ...searchParams });

    // ** chakra staff
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    if (isLoading) return <Loading />
    if (isError) return 'Error loading blogs';

    const handleSearchQuery = (e) => {
        setPageNumber(1); // Reset to first page when searching
        setSearchParams({
            title: e.target.title.value
        });
    };

    const ActionListTable = [
        {
            label: "Copy Content to Add Site",
            onClick: async (blog_id) => {
                try {
                    const blog_by_id = blogs.data.filter((blog) => blog.blog_id === blog_id)[0];
                    // set this data to localstorage
                    window.localStorage.setItem('headerContent', JSON.stringify({
                        title: blog_by_id.title,
                        image: blog_by_id.image,
                        image_alt: blog_by_id.image_alt,
                        short_description: blog_by_id.short_description
                    }));
                    window.localStorage.setItem('content', blog_by_id.description);

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
                    setBlog(blog_data[0])
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
            <CustomModal modalTitle='Blog Detail' modalSize='6xl' isOpen={isOpen} onClose={onClose} >
                {blog && (
                    <Box mx="auto" w={{ base: '100%', lg: '70%' }}>
                        <div class='content' dangerouslySetInnerHTML={{ __html: blog?.description }} />
                    </Box>
                )}
            </CustomModal>


            <form onSubmit={handleSearchQuery}>
                <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                    <Spacer />
                    <Input width={{ base: '100%', lg: '25%' }} borderLeftRadius={'2xl'} borderRightRadius={0} size={'md'} borderWidth={3} colorScheme='purple' borderColor={"#536189"}
                        focusBorderColor={"#ff79c6"} placeholder='Search By title...' name='title' />
                    <Button borderLeftRadius={0} size={'md'} colorScheme='purple'
                        type='submit'>
                        Search
                    </Button>
                </Flex>
            </form>

            <CustomTable ColumnNames={['Blog ID', 'Title', 'timestamp', 'Actions']}
                RowsAttr={["blog_id", "title", "timestamp"]} Rows={blogs.data}
                KeyAction={"blog_id"} ActionList={ActionListTable} />

            <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                <Spacer />
                <Button mr={4} colorScheme='purple' isDisabled={pageNumber === 1}
                    onClick={() => setPageNumber(prev => prev - 1)}><IoIosArrowBack /></Button>
                <Text>
                    Page {blogs.current_page} of {blogs.last_page}
                </Text>
                <Button ml={4} colorScheme='purple'
                    isDisabled={pageNumber === blogs.last_page}
                    onClick={() => setPageNumber(prev => prev + 1)}><IoIosArrowForward /></Button>
            </Flex>

        </Fragment >
    )
}

export default BlogOverview