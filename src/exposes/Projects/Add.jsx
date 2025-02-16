// Core Modules
import { Fragment, useState } from 'react'
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { FiDelete } from "react-icons/fi";
import { IconContext } from 'react-icons';
import {
    Box, Step, StepNumber, StepIndicator, StepTitle, Input, Button,
    useToast, useSteps, Stepper, TagCloseButton, Link,
    StepStatus, StepIcon, StepDescription, StepSeparator,
    Flex, Spacer, Hide, Heading, HStack, Tag, Textarea
} from '@chakra-ui/react'

// Custom Hooks
import useLocalStorage from '../../hooks/useLocalstorage';

// API Modules
import { PostProject } from '../../api/projects/POST';

// CSS
import "../../index.css"


function HeaderContent({ headerContent, setHeaderContent }) {
    return (
        <Box my={4}>
            <label>Heading</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Heading' onChange={e => setHeaderContent({ ...headerContent, heading: e.target.value })} value={headerContent.heading} />
            <label>Text</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Text' onChange={e => setHeaderContent({ ...headerContent, text: e.target.value })} value={headerContent.text} />
            <label>Image URL</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Image URL'
                onChange={e => setHeaderContent({ ...headerContent, image_url: e.target.value })} value={headerContent.image_url} />
            <label>Skills URL</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Skills URL. Example: https://skillicons.dev/icons?i=bootstrap,docker,express,mysql,javascript,githubactions,github,vercel,prisma'
                onChange={e => setHeaderContent({ ...headerContent, skills_url: e.target.value })} value={headerContent.skills_url} />
        </Box>
    )
}

function MainContent({ content, setContent }) {
    return (
        <Fragment>
            <label>Main Content</label>
            <Textarea
                value={content} onChange={(e) => setContent(e.target.value)}
                borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} type="text" placeholder="Your Project Description..." rows={8} />
        </Fragment>
    )
}

function ImageContent({ imageUrl, setImageUrl, tempImageList, setTempImageList }) {

    const [tempImageUrl, setTempImageUrl] = useState('');

    const toast = useToast()

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
        <Box my={4}>
            <HStack wrap={"wrap"}>
                {
                    tempImageList.length > 0 && tempImageList.map((imageUrl, index) => {
                        return (
                            <Tag
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
            <Input onChange={e => setTempImageUrl(e.target.value)} value={tempImageUrl}
                borderRadius={'2xl'} size={'lg'} borderWidth={3}
                colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Image URL' />
            <Button colorScheme='purple' size={"md"} onClick={handleAddedImageElement}>Add Image</Button>
        </Box>
    )
}

function ReviewContent({ token, headerContent, content, imageUrl }) {

    const toast = useToast()

    const handleSubmitProject = async () => {
        try {

            // ** validaate the header content
            if (!headerContent.heading || !headerContent.text || !headerContent.image_url || !headerContent.skills_url) {
                toast({ title: `General Information is required`, status: "error", })
                return;
            }

            // ** validate the main content
            if (!content) {
                toast({ title: `Main Content is required`, status: "error", })
                return;
            }

            if (imageUrl.length <= 0) {
                toast({ title: `Image is required`, status: "error", })
                return;
            }

            await PostProject({
                heading: headerContent.heading,
                text: headerContent.text,
                imageUrl: headerContent.image_url,
                skillsUrl: headerContent.skills_url,
                htmlContent: content,
                htmlImage: imageUrl.join('')
            }, token);

            toast({ title: `Successfully added Project Data`, status: "success", })
        } catch (err) {
            console.error(err)
            toast({ title: `Something went wrong`, status: "error", })
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
                    <Heading fontSize={'xx-large'}>{headerContent.heading}</Heading>
                    <Heading fontSize={'large'}>{headerContent.text}</Heading>
                    <pre style={{
                        marginBottom: '10px', textAlign: 'justify', whiteSpace: 'pre-wrap',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica',
                    }}>
                        {content}
                    </pre>
                    <Heading my={5} size={"md"}>User Interface (UI)</Heading>
                    <Box id='image' dangerouslySetInnerHTML={{ __html: imageUrl.join('') }}>
                    </Box>
                </Box>
            </Box>
            <Button size={'sm'} w={"100%"} colorScheme='purple' onClick={handleSubmitProject}>Publish Project</Button>
        </Fragment >
    )
}

function AddProject({ token }) {

    const toast = useToast()

    const steps = [
        { title: 'General Information', description: 'Add the general information of the Project' },
        { title: 'Main Content', description: 'Describe Your Project' },
        { title: 'Image', description: 'Upload Your Project Image using Link' },
        { title: 'Review & Publish', description: 'Cross-Check the content before publish' },
    ]

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    })

    const [headerContent, setHeaderContent] = useLocalStorage('headerContent-project', {
        heading: "",
        text: "",
        image_url: "",
        skills_url: ""
    });

    const [content, setContent] = useState(localStorage.getItem("content-project") || "");

    const [imageUrl, setImageUrl] = useLocalStorage('imageUrl-project', []);
    const [tempImageList, setTempImageList] = useLocalStorage('tempImageList-project', []);

    const handleClearContent = () => {
        setHeaderContent({ heading: "", text: "", image_url: "", skills_url: "" });
        setImageUrl([]);
        setTempImageList([]);
        setContent('');
        localStorage.removeItem("headerContent-project");
        localStorage.removeItem("content-project");
        localStorage.removeItem("imageUrl-project");
        localStorage.removeItem("tempImageList-project");
        toast({ title: `Content has been cleared`, status: "success" })
    }


    return (
        <Fragment>

            <Flex>
                <></>
                <Spacer />
                <IconContext.Provider value={{ color: "#D91656", size: "2.5em" }}>
                    <Button onClick={handleClearContent} p={0} variant={'ghost'} colorScheme='white'>
                        <FiDelete />
                    </Button>
                </IconContext.Provider>
            </Flex>

            <Hide below='lg'>
                <Stepper colorScheme='purple' index={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>

                            <Box flexShrink='0'>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
            </Hide>

            <Flex mb={4}>
                <Button
                    mt={4}
                    colorScheme='purple'
                    onClick={() => setActiveStep(activeStep === 0 ? 0 : activeStep - 1)}
                    isDisabled={activeStep === 0}>
                    <IoMdArrowDropleft />
                </Button>
                <Spacer />
                <Button
                    mt={4}
                    colorScheme='purple'
                    onClick={() => setActiveStep(activeStep === steps.length - 1 ? steps.length - 1 : activeStep + 1)}
                    isDisabled={activeStep === steps.length - 1}>
                    <IoMdArrowDropright />
                </Button>
            </Flex>

            {activeStep === 0 && (<HeaderContent headerContent={headerContent} setHeaderContent={setHeaderContent} />)}
            {activeStep === 1 && (<MainContent content={content} setContent={setContent} />)}
            {activeStep === 2 && (<ImageContent imageUrl={imageUrl} setImageUrl={setImageUrl} tempImageList={tempImageList} setTempImageList={setTempImageList} />)}
            {activeStep === 3 && (<ReviewContent token={token} headerContent={headerContent} content={content} imageUrl={imageUrl} />)}

        </Fragment>
    )
}

export default AddProject