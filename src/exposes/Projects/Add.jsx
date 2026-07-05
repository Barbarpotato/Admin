// Core Modules
import {
    Box, Input, Button, TagCloseButton, IconButton, Divider,
    Link, Heading, HStack, Flex, Spacer, Tag, Textarea
} from '@chakra-ui/react'
import { Fragment, useState } from 'react'
import { FiDelete } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

// Context
import { useGlobalContext } from '../../contexts/GlobalContext';

// Custom Hooks
import useLocalStorage from '../../hooks/useLocalstorage';

// Custom Components
import FormSection from '../../components/FormSection';
import ImageUrlPicker from '../../components/ImageUrlPicker';

const dividerStyle = { my: 6, borderColor: 'rgba(134, 107, 171, 0.25)' };


const inputStyle = {
    borderRadius: '2xl', size: 'lg', borderWidth: 2, colorScheme: 'purple',
    borderColor: '#866bab', focusBorderColor: '#cc7bc9', my: 2,
}

function AddProject({ token }) {

    const { toast } = useGlobalContext();
    const navigate = useNavigate();

    const [headerContent, setHeaderContent] = useLocalStorage('headerContent-project', {
        heading: "",
        text: "",
        image_url: "",
        skills_url: ""
    });

    const [content, setContentState] = useState(() => localStorage.getItem("content-project") || "");

    // ** persisted as a plain string (not JSON) to stay compatible with how
    // ** Projects/Overview.jsx's "Copy Content to Add Site" writes this key
    const updateContent = (value) => {
        setContentState(value);
        localStorage.setItem("content-project", value);
    };

    const [imageUrl, setImageUrl] = useLocalStorage('imageUrl-project', []);
    const [tempImageList, setTempImageList] = useLocalStorage('tempImageList-project', []);

    const handleClearContent = () => {
        setHeaderContent({ heading: "", text: "", image_url: "", skills_url: "" });
        setImageUrl([]);
        setTempImageList([]);
        setContentState('');
        localStorage.removeItem("headerContent-project");
        localStorage.removeItem("content-project");
        localStorage.removeItem("imageUrl-project");
        localStorage.removeItem("tempImageList-project");
        toast({ title: `Content has been cleared`, status: "success" })
    }

    return (
        <Fragment>
            <Flex mb={4} align={'center'}>
                <Heading size={'lg'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={700} color={'#faf9ff'}>
                    Add Project
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
                <FormSection title='Header' description='Add the general information of the Project'>
                    <label>Heading</label>
                    <Input {...inputStyle} placeholder='Heading' onChange={e => setHeaderContent({ ...headerContent, heading: e.target.value })} value={headerContent.heading} />
                    <label>Text</label>
                    <Input {...inputStyle} placeholder='Text' onChange={e => setHeaderContent({ ...headerContent, text: e.target.value })} value={headerContent.text} />
                    <label>Image URL</label>
                    <Input {...inputStyle} placeholder='Image URL'
                        onChange={e => setHeaderContent({ ...headerContent, image_url: e.target.value })} value={headerContent.image_url} />
                    <label>Skills URL</label>
                    <Input {...inputStyle} placeholder='Skills URL. Example: https://skillicons.dev/icons?i=bootstrap,docker,express,mysql,javascript,githubactions,github,vercel,prisma'
                        onChange={e => setHeaderContent({ ...headerContent, skills_url: e.target.value })} value={headerContent.skills_url} />
                </FormSection>

                <Divider {...dividerStyle} />

                <FormSection title='Main Content' description='Describe Your Project'>
                    <Textarea
                        value={content} onChange={(e) => updateContent(e.target.value)}
                        borderRadius={'2xl'} size={'lg'} borderWidth={2} colorScheme='purple' borderColor={"#866bab"} focusBorderColor={"#cc7bc9"}
                        my={2} type="text" placeholder="Your Project Description..." rows={8} />
                </FormSection>

                <Divider {...dividerStyle} />

                <FormSection title='Image' description='Upload Your Project Image using Link'>
                    <ImageContent token={token} imageUrl={imageUrl} setImageUrl={setImageUrl} tempImageList={tempImageList} setTempImageList={setTempImageList} />
                </FormSection>

                <Button mt={6} size={'md'} w={"100%"} bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }} onClick={() => navigate('/PreviewProject')}>
                    Preview
                </Button>
            </Box>
        </Fragment>
    )
}

function ImageContent({ token, imageUrl, setImageUrl, tempImageList, setTempImageList }) {

    const [tempImageUrl, setTempImageUrl] = useState('');

    const handleAddedImageElement = () => {

        setTempImageList((prev) => [...prev, tempImageUrl]);

        // ** manipulating the image url wrap with the image tag
        const imageElement = `<img src="${tempImageUrl}" width="600px" height="600px"/>`;

        // ** add the image to the content
        setImageUrl((prevUrl) => [...prevUrl, imageElement]);

        // ** reset the temp image url
        setTempImageUrl('');
    }

    const removeImageElement = (index) => {
        // ** remove the image from the content
        setTempImageList(tempImageList.filter((_, i) => i !== index));
        setImageUrl(imageUrl.filter((_, i) => i !== index));
    }

    return (
        <Box>
            <HStack wrap={"wrap"}>
                {
                    tempImageList.length > 0 && tempImageList.map((imageUrl, index) => {
                        return (
                            <Tag
                                key={index}
                                size={"lg"}
                                borderRadius='full'
                                variant='solid'
                                colorScheme='purple'
                            >
                                <Link href={imageUrl} target="_blank">Image {index + 1}</Link>
                                <TagCloseButton onClick={() => removeImageElement(index)} />
                            </Tag>
                        )
                    })
                }
            </HStack>
            <label>Image URL</label>
            <ImageUrlPicker
                folder='project-content' token={token}
                value={tempImageUrl} onChange={setTempImageUrl}
                placeholder='Search uploaded images or paste an Image URL'
            />
            <Button bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }} size={"md"} onClick={handleAddedImageElement}>Add Image</Button>
        </Box>
    )
}

export default AddProject
