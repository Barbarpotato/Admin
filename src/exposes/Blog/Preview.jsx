// Core Modules
import { Fragment, useState } from 'react'
import { Box, Button, Heading, Text, Image, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

// Context
import { useGlobalContext } from '../../contexts/GlobalContext'

// API Modules
import { PostBlog, PostBlogTags } from "../../api/labs/POST"

function BlogPreview({ token }) {

    const { toast } = useGlobalContext();
    const navigate = useNavigate();

    const [headerContent] = useState(() => {
        const saved = localStorage.getItem("headerContent");
        return saved ? JSON.parse(saved) : { title: '', short_description: '', image: '', image_alt: '' };
    });
    const [content] = useState(() => localStorage.getItem("content") || '');
    const [tags] = useState(() => {
        const saved = localStorage.getItem("tags");
        return saved ? JSON.parse(saved) : [];
    });

    const hasContent = content && content.length > 300;

    const handleClearContent = () => {
        localStorage.removeItem("headerContent");
        localStorage.removeItem("content");
        localStorage.removeItem("tags");
    };

    const handleSubmitBlog = async () => {
        try {

            // ** Validate the header content
            if (!headerContent.title || !headerContent.short_description || !headerContent.image || !headerContent.image_alt) {
                toast({
                    title: `General Information is required`,
                    status: "error",
                });
                return;
            }

            // ** Validate the main content
            if (!content) {
                toast({
                    title: `Main Content is required`,
                    status: "error",
                });
                return;
            }

            if (content.length <= 300) {
                toast({
                    title: `Your Content is too short to be published`,
                    status: "error",
                });
                return;
            }

            if (!tags || tags.length <= 0) {
                toast({
                    title: `Tags is required`,
                    status: "error",
                });
                return;
            }

            // ** Wrap all <pre> tags with a <div> wrapper
            const wrappedContent = content.replace(
                /<pre\s+class="ql-syntax"\s+spellcheck="false">([\s\S]*?)<\/pre>/g,
                `<div><pre><code>$1</code></pre></div>`
            );

            // ** Post the blog content
            const response = await PostBlog({ ...headerContent, description: wrappedContent }, token);

            if (!response) {
                toast({
                    title: `Something went wrong`,
                    status: "error",
                });
                return;
            }

            // ** Create tags for this blog
            await PostBlogTags(response.blog_id, tags, token); // Assuming response contains the blog ID

            toast({
                title: `Successfully added Blog Data`,
                status: "success",
            });

            handleClearContent();
            navigate('/Blog');

        } catch (err) {
            console.error(err);
            toast({
                title: `Something went wrong`,
                status: "error",
            });
        }
    };

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

            <Box maxW={'760px'} mx="auto">
                <Heading size={'sm'} fontFamily={'var(--font-outfit)'} fontWeight={600} color={'#faf9ff'} mb={4}>
                    Preview
                </Heading>

                {!hasContent && (
                    <Text color={'#c0c0c0'} fontSize={'sm'}>
                        Preview will appear here once Main Content has at least 300 characters.
                    </Text>
                )}
                {hasContent && (
                    <Box>
                        <Heading fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#faf9ff'}>
                            {headerContent.title}
                        </Heading>
                        {headerContent.short_description && (
                            <Text fontSize={'lg'} mt={2} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#cc7bc9'}>
                                {headerContent.short_description}
                            </Text>
                        )}
                        {headerContent.image && (
                            <Image
                                src={headerContent.image} alt={headerContent.image_alt}
                                mt={4} w="100%" maxH={'360px'} objectFit={'cover'} borderRadius={'xl'}
                            />
                        )}
                        <Box
                            className='content' mt={4}
                            sx={{ lineHeight: 1.8, color: '#d0d0d0', fontFamily: 'var(--font-outfit)', overflowX: 'auto' }}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </Box>
                )}

                <Button mt={6} size={'md'} w={"100%"} bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }} onClick={handleSubmitBlog}>
                    Publish Blog
                </Button>
            </Box>
        </Fragment>
    )
}

export default BlogPreview
