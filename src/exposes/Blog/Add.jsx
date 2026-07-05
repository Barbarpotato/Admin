// Core Modules
import { Fragment, useState, useEffect } from 'react'
import {
    Input, Box, Tag, TagLabel, TagCloseButton, Spinner, Wrap, Button, Divider,
    WrapItem, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Flex, Spacer, IconButton
} from "@chakra-ui/react";
import ReactQuill from 'react-quill';
import { FiDelete } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

// Context
import { useGlobalContext } from '../../contexts/GlobalContext';

// Custom Components
import FormSection from '../../components/FormSection';
import ImageUrlPicker from '../../components/ImageUrlPicker';

// API Modules
import { useTagSearch } from '../../api/labs/GET';

// CSS
import 'react-quill/dist/quill.snow.css';


const inputStyle = {
    borderRadius: '2xl', size: 'lg', borderWidth: 2, colorScheme: 'purple',
    borderColor: '#866bab', focusBorderColor: '#cc7bc9', my: 2,
}

const dividerStyle = { my: 6, borderColor: 'rgba(134, 107, 171, 0.25)' };

function AddBlog({ token }) {

    const { toast } = useGlobalContext();
    const navigate = useNavigate();

    const [headerContent, setHeaderContent] = useState(() => {
        const savedHeaderContent = localStorage.getItem("headerContent");
        return savedHeaderContent ? JSON.parse(savedHeaderContent) : {
            title: '',
            short_description: '',
            description: '',
            image: '',
            image_alt: ''
        };
    });

    const updateHeaderContent = (newContent) => {
        setHeaderContent(newContent);
        localStorage.setItem("headerContent", JSON.stringify(newContent));
    };

    const [content, setContent] = useState(() => {
        const savedContent = localStorage.getItem("content");
        return savedContent ? savedContent : '';
    });

    const updateContent = (newContent) => {
        setContent(newContent);
        localStorage.setItem("content", newContent);
    };

    const [tags, setTags] = useState([]);

    const handleClearContent = () => {
        updateHeaderContent({ title: '', short_description: '', image: '', image_alt: '' });
        updateContent('');
        setTags([]);
        localStorage.removeItem("headerContent");
        localStorage.removeItem("content");
        localStorage.removeItem("tags");
        toast({
            title: `Content has been cleared`,
            status: "success"
        })
    }

    useEffect(() => {

        // **
        // -- Load data from localStorage if it exists
        const storedHeaderContent = localStorage.getItem("headerContent");
        const storedContent = localStorage.getItem("content");

        if (storedHeaderContent) {
            setHeaderContent(JSON.parse(storedHeaderContent));
        }
        if (storedContent) {
            setContent(storedContent);
        }

        if (storedContent) {
            toast({
                title: `Restoring Content Data`,
                status: "success",
            })
        }

    }, []);

    // **
    // -- Save content to localStorage
    const saveDataToLocalStorage = () => {
        try {
            localStorage.setItem("headerContent", JSON.stringify(headerContent));
            localStorage.setItem("content", content);
        } catch (err) {
            console.error("Failed to save data to localStorage", err);
        }
    };

    useEffect(() => {

        // **
        // --Attach the event listener for tab close
        const handleBeforeUnload = () => {
            saveDataToLocalStorage();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        // **
        // -- Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [headerContent, content]);

    return (
        <Fragment>
            <Flex mb={4} align={'center'}>
                <Heading size={'lg'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={700} color={'#faf9ff'}>
                    Add Blog
                </Heading>
                <Spacer />
                <IconButton
                    aria-label='Clear content'
                    icon={<FiDelete />}
                    size={'sm'} variant={'ghost'} colorScheme='red'
                    onClick={handleClearContent}
                />
            </Flex>

            <Box maxW={'720px'} mx="auto">
                <FormSection title='General Information' description='Add the general information of the blog'>
                    <HeaderContent headerContent={headerContent} updateHeaderContent={updateHeaderContent} />
                </FormSection>

                <Divider {...dividerStyle} />

                <FormSection title='Main Content' description='Add the main content of the blog'>
                    <MainContent token={token} content={content} updateContent={updateContent} />
                </FormSection>

                <Divider {...dividerStyle} />

                <FormSection title='Tags' description='Add the tags content of the blog'>
                    <TagsContent tags={tags} setTags={setTags} />
                </FormSection>

                <Button mt={6} size={'md'} w={"100%"} bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }} onClick={() => navigate('/PreviewBlog')}>
                    Preview
                </Button>
            </Box>
        </Fragment>
    )
}


function HeaderContent({ headerContent, updateHeaderContent }) {
    return (
        <Box>
            <label>Title</label>
            <Input {...inputStyle} placeholder='Title' onChange={e => updateHeaderContent({ ...headerContent, title: e.target.value })} value={headerContent.title} />
            <label>Short Description</label>
            <Input {...inputStyle} placeholder='Short Description' onChange={e => updateHeaderContent({ ...headerContent, short_description: e.target.value })} value={headerContent.short_description} />
            <label>Image</label>
            <Input {...inputStyle} placeholder='Image Cover' onChange={e => updateHeaderContent({ ...headerContent, image: e.target.value })} value={headerContent.image} />
            <label>Image Alt</label>
            <Input {...inputStyle} placeholder='Image Alt' onChange={e => updateHeaderContent({ ...headerContent, image_alt: e.target.value })} value={headerContent.image_alt} />
        </Box>
    )
}


function MainContent({ token, content, updateContent }) {

    // Custom image handler to add an image with a link
    const modules = {
        toolbar: {
            container: [
                [{ 'font': [] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'color': [] }, { 'background': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
            ]
        }
    };

    const toast = useToast()
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');

    const handleAddedImageElement = () => {

        // ** validate the the inserted iamge
        if (!imageUrl || !imageAlt) {
            toast({
                title: `Image Url and Image Alt is required`,
                status: "error",
            })
            return;
        }

        const imageElement = `<img src="${imageUrl}" alt="${imageAlt}" width="720px"/>`;
        // addedm img link to the content
        updateContent(prev => prev + imageElement);
        setImageAlt('');
        setImageUrl('');
    }


    return (
        <Tabs variant='solid-rounded' colorScheme='purple'>
            <TabList>
                <Tab>Description</Tab>
                <Tab>Insert Image Link</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <div style={{ paddingBottom: '100px', borderColor: 'purple', height: '600px' }}>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={(e) => updateContent(e)}
                            modules={modules}
                            style={{
                                height: '100%', // Make the ReactQuill fill the container
                            }}
                        />
                    </div>
                </TabPanel>
                <TabPanel>
                    <label>Image Url</label>
                    <ImageUrlPicker
                        folder='blog-content' token={token}
                        value={imageUrl} onChange={setImageUrl}
                        onSelect={(image) => { if (!imageAlt) setImageAlt(image.name); }}
                        placeholder='Search uploaded images or paste an Image Url'
                    />
                    <label>Image Alt</label>
                    <Input {...inputStyle} value={imageAlt} placeholder='Image Alt' onChange={e => setImageAlt(e.target.value)} />
                    <Button bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }} size={'sm'} onClick={handleAddedImageElement} >Insert Image</Button>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}


function TagsContent({ tags, setTags }) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: tagOptions = [], isLoading } = useTagSearch(debouncedSearch);

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            const updatedTags = [...tags, tag];
            setTags(updatedTags);
            localStorage.setItem("tags", JSON.stringify(updatedTags));
        }
        setSearch("");
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        localStorage.setItem("tags", JSON.stringify(updatedTags));
    };

    const canCreateNewTag = debouncedSearch && !tagOptions.includes(debouncedSearch) && !tags.includes(debouncedSearch);

    useEffect(() => {
        const storedTags = localStorage.getItem("tags");
        if (storedTags) {
            try {
                setTags(JSON.parse(storedTags));
            } catch (err) {
                console.error("Failed to parse tags from localStorage", err);
            }
        }
    }, [setTags]);

    return (
        <Box>
            <Input
                placeholder="Search or create new tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                {...inputStyle}
            />

            {isLoading ? (
                <Spinner size="sm" my={2} />
            ) : (
                debouncedSearch && (
                    <Wrap my={2}>
                        {tagOptions.map((tag, index) => (
                            <WrapItem key={index}>
                                <Tag
                                    size="md"
                                    borderRadius="full"
                                    variant="solid"
                                    colorScheme="purple"
                                    cursor="pointer"
                                    onClick={() => handleAddTag(tag)}
                                >
                                    <TagLabel>{tag}</TagLabel>
                                </Tag>
                            </WrapItem>
                        ))}

                        {canCreateNewTag && (
                            <WrapItem>
                                <Button
                                    size="xs"
                                    borderRadius="full"
                                    colorScheme="green"
                                    onClick={() => handleAddTag(debouncedSearch)}
                                >
                                    Create New Tag "{debouncedSearch}"
                                </Button>
                            </WrapItem>
                        )}
                    </Wrap>
                )
            )}

            <Wrap mt={4}>
                {tags.map((tag, index) => (
                    <WrapItem key={index}>
                        <Tag
                            size="md"
                            borderRadius="full"
                            variant="subtle"
                            colorScheme="purple"
                        >
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                        </Tag>
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
}



export default AddBlog
