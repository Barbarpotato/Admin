// Core Modules
import { useEffect, useState } from 'react'
import { Box, Badge, Heading, Text, Image, Wrap, WrapItem, Divider } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

// API Modules
import { fetchBlogById } from '../../api/labs/GET.js'

// Custom Components
import Loading from '../../components/Loading.jsx'

function BlogDetail() {

    const { blog_id } = useParams();

    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetchBlogById(blog_id);
                if (!cancelled) setBlog(response.data[0]);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [blog_id]);

    if (isLoading) return <Loading />;

    if (!blog) {
        return (
            <Heading size={'md'} color={'red.300'}>Blog post not found.</Heading>
        );
    }

    return (
        <Box mx="auto" maxW={'760px'}>
            <Heading
                fontSize={{ base: 'xx-large', lg: 'xxx-large' }}
                fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={700} color={'#faf9ff'}
            >
                {blog.title}
            </Heading>

            {blog.timestamp && (
                <Text fontSize={'sm'} color={'#c0c0c0'} mt={2}>
                    {blog.timestamp}
                </Text>
            )}

            {blog.short_description && (
                <Text fontSize={'lg'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#cc7bc9'} mt={3}>
                    {blog.short_description}
                </Text>
            )}

            {blog.tags?.length > 0 && (
                <Wrap mt={4}>
                    {blog.tags.map((tag, i) => (
                        <WrapItem key={i}>
                            <Badge colorScheme="purple" borderRadius={'full'} px={3} py={1}>
                                {tag}
                            </Badge>
                        </WrapItem>
                    ))}
                </Wrap>
            )}

            {blog.image && (
                <Image
                    src={blog.image} alt={blog.image_alt || blog.title}
                    mt={6} w="100%" maxH={'360px'} objectFit={'cover'} borderRadius={'xl'}
                />
            )}

            <Divider my={6} borderColor={'rgba(134, 107, 171, 0.25)'} />

            <Box
                className="content"
                sx={{ lineHeight: 1.8, fontSize: 'md', color: '#d0d0d0', fontFamily: 'var(--font-outfit)' }}
                dangerouslySetInnerHTML={{ __html: blog.description }}
            />
        </Box>
    );
}

export default BlogDetail
