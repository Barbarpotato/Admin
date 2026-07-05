// Core Modules
import { Fragment, useRef, useState } from 'react'
import {
    Flex, IconButton, Button,
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay, useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiCopy, FiEye, FiTrash2 } from 'react-icons/fi';

// API Modules
import { DeleteBlog } from '../../api/labs/DELETE.js';
import { useDatablogs, fetchBlogById } from '../../api/labs/GET.js'

// Context
import { useGlobalContext } from '../../contexts/GlobalContext.jsx';

// Component Modules
import Search from '../../components/Search.jsx';
import CustomTable from '../../components/Table.jsx';
import Pagination from '../../components/Pagination.jsx';
import Loading from '../../components/Loading.jsx';


function BlogOverview({ token }) {

    // ** Global Context
    const { pageNumber, searchParams, toast } = useGlobalContext();
    const navigate = useNavigate();

    // ** React query api call
    const { data: blogs, isLoading, isError, refetch } = useDatablogs({ page: pageNumber, ...searchParams });

    const [deleteTarget, setDeleteTarget] = useState(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelDeleteRef = useRef(null);

    if (isLoading) return <Loading />
    if (isError) return 'Error loading blogs';

    const handleCopy = async (blog_id) => {
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
    };

    const handleDetails = (blog_id) => {
        navigate(`/BlogDetail/${blog_id}`);
    };

    const requestDelete = (blog_id) => {
        setDeleteTarget(blog_id);
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await DeleteBlog(deleteTarget, token)
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
        } finally {
            setDeleteTarget(null);
            onDeleteClose();
        }
    };

    return (
        <Fragment>

            <Search searchKey={"title"} />

            <CustomTable
                ColumnNames={['Title', 'Created', "Blog ID", 'Actions']}
                RowsAttr={["title", "timestamp", "blog_id"]} Rows={blogs.data} KeyAction={"blog_id"}
                renderActions={(blog_id) => (
                    <Flex gap={1}>
                        <IconButton
                            aria-label="Copy content to Add Site" icon={<FiCopy />}
                            size="sm" variant="ghost" color={'#866bab'} _hover={{ color: '#cc7bc9', bg: 'rgba(134, 107, 171, 0.15)' }}
                            onClick={() => handleCopy(blog_id)}
                        />
                        <IconButton
                            aria-label="View details" icon={<FiEye />}
                            size="sm" variant="ghost" color={'#866bab'} _hover={{ color: '#cc7bc9', bg: 'rgba(134, 107, 171, 0.15)' }}
                            onClick={() => handleDetails(blog_id)}
                        />
                        <IconButton
                            aria-label="Delete blog" icon={<FiTrash2 />}
                            size="sm" variant="ghost" colorScheme="red"
                            onClick={() => requestDelete(blog_id)}
                        />
                    </Flex>
                )}
            />

            <Pagination paginationData={blogs} />

            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelDeleteRef} onClose={onDeleteClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent bg={'#383a4a'} color={'#faf9ff'}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete blog</AlertDialogHeader>

                        <AlertDialogBody color={'#c0c0c0'}>
                            Are you sure you want to delete this blog post? This cannot be undone.
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
        </Fragment >
    )
}

export default BlogOverview
