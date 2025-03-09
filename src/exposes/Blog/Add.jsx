// Core Modules
import { Fragment, useState, useEffect } from 'react'
import {
    Box, Tabs, TabList, TabPanels, Tab, TabPanel, Input,
    Button, useToast, Text, Image, Heading
} from '@chakra-ui/react'
import ReactQuill from 'react-quill';

// Context
import { useGlobalContext } from '../../contexts/GlobalContext';

// Custom Components
import CustomStepper from '../../components/Stepper';

// API Modules
import { PostBlog } from "../../api/labs/POST"

// CSS
import 'react-quill/dist/quill.snow.css';


function AddBlog({ token }) {

    const { toast } = useGlobalContext();

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

    const handleClearContent = () => {
        updateHeaderContent({ title: '', short_description: '', image: '', image_alt: '' });
        updateContent('');
        localStorage.removeItem("headerContent");
        localStorage.removeItem("content");
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

    const steps = [
        { title: 'General Information', description: 'Add the general information of the blog', childComponent: <HeaderContent headerContent={headerContent} updateHeaderContent={updateHeaderContent} /> },
        { title: 'Main Content', description: 'Add the main content of the blog', childComponent: <MainContent content={content} updateContent={updateContent} /> },
        { title: 'Review & Publish', description: 'Cross-Check the content before publish', childComponent: <ReviewContent token={token} headerContent={headerContent} content={content} updateHeaderContent={updateHeaderContent} updateContent={updateContent} /> },
    ]

    return (
        <CustomStepper steps={steps} handleClearContent={handleClearContent} />
    )
}


function HeaderContent({ headerContent, updateHeaderContent }) {
    return (
        <Box my={4}>
            <label>Title</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Title' onChange={e => updateHeaderContent({ ...headerContent, title: e.target.value })} value={headerContent.title} />
            <label>Short Description</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Short Description' onChange={e => updateHeaderContent({ ...headerContent, short_description: e.target.value })} value={headerContent.short_description} />
            <label>Image</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Image Cover' onChange={e => updateHeaderContent({ ...headerContent, image: e.target.value })} value={headerContent.image} />
            <label>Image Alt</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Image Alt' onChange={e => updateHeaderContent({ ...headerContent, image_alt: e.target.value })} value={headerContent.image_alt} />
        </Box>
    )
}

function MainContent({ content, updateContent }) {

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
                    <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                        my={2} value={imageUrl} placeholder='Image Url' onChange={e => setImageUrl(e.target.value)} />
                    <label>Image Alt</label>
                    <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                        my={2} value={imageAlt} placeholder='Image Alt' onChange={e => setImageAlt(e.target.value)} />
                    <Button colorScheme='purple' size={'sm'} onClick={handleAddedImageElement} >Insert Image</Button>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

function ReviewContent({ token, headerContent, content, updateHeaderContent, updateContent }) {

    const toast = useToast()

    const handleSubmitBlog = async () => {
        try {

            // ** validaate the header content
            if (!headerContent.title || !headerContent.short_description || !headerContent.image || !headerContent.image_alt) {
                toast({
                    title: `General Information is required`,
                    status: "error",
                })
                return;
            }

            // ** validate the main content
            if (!content) {
                toast({
                    title: `Main Content is required`,
                    status: "error",
                })
                return;
            }

            // ** Wrap all <pre> tags with a <div> wrapper
            // ** Wrap all <pre> tags with <div> and wrap inner content with <code>
            const wrappedContent = content.replace(
                /<pre\s+class="ql-syntax"\s+spellcheck="false">([\s\S]*?)<\/pre>/g,
                `<div><pre><code>$1</code></pre></div>`
            );

            await PostBlog({ ...headerContent, description: wrappedContent }, token);
            toast({
                title: `Successfully added Blog Data`,
                status: "success",
            })

            // **
            // -- clear the state
            updateHeaderContent({ title: '', short_description: '', image: '', image_alt: '' })
            updateContent('')

            // **
            // -- clear the localstorage
            localStorage.removeItem("headerContent");
            localStorage.removeItem("content");

        } catch (err) {
            console.error(err)
            toast({
                title: `Something went wrong`,
                status: "error",
            })
        }
    }

    if (!content) {
        return (
            <Heading size={"md"} color={"red"} textAlign={'center'}>Oops! There is no content at the moment</Heading>
        )
    }

    if (content.length <= 300) {
        return (
            <Heading size={"md"} color={"red"} textAlign={'center'}>Your Content is too short to be published</Heading>
        )
    }


    return (
        <Fragment>
            <Box mx="auto" w={'100%'} display="flex" justifyContent="center" >
                <Box width={{ base: '65%', sm: '35%' }}>
                    <Heading>{headerContent.title}</Heading>
                    <Image src={headerContent.image} alt={headerContent.image_alt} width="720px" />
                    <Text>{headerContent.short_description}</Text>
                    <div className='content' style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: content }} />
                </Box>
            </Box>
            <Button size={'sm'} w={"100%"} colorScheme='purple' onClick={handleSubmitBlog}>Publish Blog</Button>
        </Fragment >
    )
}

export default AddBlog