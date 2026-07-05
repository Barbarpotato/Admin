// Core Modules
import { Fragment, useState } from 'react'
import { Box, Button, Heading, Text, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

// Context
import { useGlobalContext } from '../../contexts/GlobalContext'

// Custom Hooks
import useLocalStorage from '../../hooks/useLocalstorage'

// API Modules
import { PostProject } from '../../api/projects/POST'

function ProjectPreview({ token }) {

    const { toast } = useGlobalContext();
    const navigate = useNavigate();

    const [headerContent, setHeaderContent] = useLocalStorage('headerContent-project', {
        heading: "", text: "", image_url: "", skills_url: ""
    });
    const [imageUrl, setImageUrl] = useLocalStorage('imageUrl-project', []);
    const [tempImageList, setTempImageList] = useLocalStorage('tempImageList-project', []);

    // ** stored as a plain string (not JSON) by Add.jsx / Overview.jsx's "Copy Content"
    const [content] = useState(() => localStorage.getItem('content-project') || '');

    const hasContent = content && content.length > 300 && imageUrl.length > 0;

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

            if (content.length <= 300) {
                toast({ title: `Your Content is too short to be published`, status: "error", })
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

            setHeaderContent({ heading: "", text: "", image_url: "", skills_url: "" });
            setImageUrl([]);
            setTempImageList([]);
            localStorage.removeItem("headerContent-project");
            localStorage.removeItem("content-project");
            localStorage.removeItem("imageUrl-project");
            localStorage.removeItem("tempImageList-project");

            toast({ title: `Successfully added Project Data`, status: "success", })
            navigate('/ProjectOverview');

        } catch (err) {
            console.error(err)
            toast({ title: `Something went wrong`, status: "error", })
        }
    }

    return (
        <Fragment>
            <Flex mb={4} align={'center'}>
                <Button
                    onClick={() => navigate(-1)} leftIcon={<FiArrowLeft />}
                    variant={'ghost'} color={'#866bab'} _hover={{ color: '#cc7bc9' }}
                >
                    Back to Edit
                </Button>
            </Flex>

            <Box maxW={'720px'} mx="auto">
                <Heading size={'sm'} fontFamily={'var(--font-outfit)'} fontWeight={600} color={'#faf9ff'} mb={4}>
                    Preview
                </Heading>

                {!hasContent && (
                    <Text color={'#c0c0c0'} fontSize={'sm'}>
                        Preview will appear here once Heading, Main Content (300+ characters) and at least one Image are filled in.
                    </Text>
                )}
                {hasContent && (
                    <Box>
                        <Heading fontSize={'xx-large'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#faf9ff'}>
                            {headerContent.heading}
                        </Heading>
                        <Text fontSize={'lg'} mt={1} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#cc7bc9'}>
                            {headerContent.text}
                        </Text>
                        <Text
                            mt={4} whiteSpace={'pre-wrap'} textAlign={'justify'}
                            fontFamily={'var(--font-outfit)'} color={'#d0d0d0'} lineHeight={1.8}
                        >
                            {content}
                        </Text>
                        <Heading size={'sm'} fontFamily={'var(--font-outfit)'} fontWeight={600} color={'#faf9ff'} mt={6} mb={4}>
                            User Interface (UI)
                        </Heading>
                        <Box
                            id='image'
                            sx={{
                                display: 'flex', flexWrap: 'wrap', gap: '12px',
                                '& img': {
                                    width: '160px', height: '160px', objectFit: 'cover',
                                    borderRadius: '12px', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
                                },
                            }}
                            dangerouslySetInnerHTML={{ __html: imageUrl.join('') }}
                        />
                    </Box>
                )}

                <Button mt={6} size={'md'} w={"100%"} bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }} onClick={handleSubmitProject}>
                    Publish Project
                </Button>
            </Box>
        </Fragment>
    )
}

export default ProjectPreview
