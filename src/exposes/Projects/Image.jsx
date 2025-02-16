// Core Modules
import React from 'react'
import { CiImageOn } from "react-icons/ci";
import {
    Tabs, TabList, TabPanels, Tab, TabPanel, Spacer,
    Button, Input, useToast, Flex, Text
} from '@chakra-ui/react'

// API Modules
import { uploadFile } from '../../api/storage/POST'
import { fetchFiles } from '../../api/storage/GET'
import { deleteFile } from '../../api/storage/DELETE'


function ImageProject({ token }) {
    const toast = useToast();
    const fileInputRef = React.useRef(null);
    const [images, setImages] = React.useState([]);
    const [nextPageToken, setNextPageToken] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");

    const fetchImages = async (pageToken = "", search = "") => {
        try {
            const response = await fetchFiles({ folder: 'project-content', pageToken, search, token });
            setImages(response.files);
            setNextPageToken(response.nextPageToken);
        } catch (error) {
            toast({
                title: 'Failed to fetch images',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Failed to fetch images:', error);
        }
    };

    React.useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async () => {
        const file = fileInputRef.current.files[0];

        if (!file) {
            toast({
                title: 'No file selected',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('No file selected');
            return;
        }

        try {
            await uploadFile('project-content', file, token);
            toast({
                title: 'Image uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fileInputRef.current.value = '';
            fetchImages(); // Refresh the image list after upload
        } catch (error) {
            toast({
                title: 'Upload failed',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Upload failed:', error);
        }
    };

    const handleDelete = async (fileName) => {
        try {
            await deleteFile('project-content', fileName, token);
            toast({
                title: 'Image deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchImages(); // Refresh the image list after deletion
        } catch (error) {
            toast({
                title: 'Delete failed',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Delete failed:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        fetchImages("", event.target.value);
    };

    return (
        <Tabs variant={'line'} colorScheme='purple'>
            <TabList>
                <Tab>Image List</Tab>
                <Tab>Upload Image</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Flex direction="column" align="center">
                        <Input
                            size={'md'} borderWidth={3} colorScheme='purple' borderColor={"#536189"}
                            placeholder="Search images..." focusBorderColor={"#ff79c6"}
                            value={searchTerm}
                            onChange={handleSearch}
                            mb={4}
                        />
                        {images.map((image, index) => {
                            if (image.name === "") return null;
                            return (
                                <Flex key={index} direction="row" align="center" justify="space-between" w="100%" p={2} borderBottom="1px solid #e2e8f0">
                                    <CiImageOn size={20} />
                                    <Text width={{ base: '100%', md: 'auto' }} fontSize={{ base: 'sm', md: 'md' }} ml={4}>
                                        {window.innerWidth > 1280 ? image.name : (image.name.length > 20 ? image.name.slice(0, 20) + "..." : image.name)}
                                    </Text>
                                    <Spacer />
                                    <a href={image.url} target="_blank" rel="noopener noreferrer">
                                        <Button size={{ base: 'sm', md: 'md' }} textDecoration={'underline'} variant={'unstyled'} colorScheme='purple'>Link</Button>
                                    </a>
                                    <Button size={{ base: 'sm', md: 'md' }} onClick={() => handleDelete(image.name)} colorScheme='red' color={'red.500'}
                                        variant={'unstyled'} ml={{ base: 0, md: 2 }}>Delete</Button>
                                </Flex>
                            );
                        })}
                        <Flex mt={4} justify="center" w="100%">
                            <Spacer />
                            {nextPageToken && (
                                <Button onClick={() => fetchImages(nextPageToken, searchTerm)} colorScheme='purple'>
                                    Load More
                                </Button>
                            )}
                        </Flex>
                    </Flex>
                </TabPanel>
                <TabPanel>
                    <Input ref={fileInputRef} variant={'unstyled'} type="file" accept="image/*" />
                    <Button onClick={handleUpload} mt={4} colorScheme='purple' type="button">Upload Image</Button>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

export default ImageProject
