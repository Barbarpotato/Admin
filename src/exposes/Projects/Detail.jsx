// Core Modules
import { Box, Heading, Text, Divider } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'

function ProjectDetail() {

    const location = useLocation();
    const project = location.state?.project;

    if (!project) {
        return (
            <Heading size={'md'} color={'red.300'}>No project selected.</Heading>
        );
    }

    return (
        <Box mx="auto" maxW={'720px'}>
            <Heading
                fontSize={{ base: 'xx-large', lg: 'xxx-large' }}
                fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={700} color={'#faf9ff'}
            >
                {project.heading}
            </Heading>
            <Text
                fontSize={{ base: 'lg', lg: 'xl' }} mt={2}
                fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#cc7bc9'}
            >
                {project.text}
            </Text>

            <Divider my={6} borderColor={'rgba(134, 107, 171, 0.25)'} />

            {/* Plain text field: whiteSpace preserves the author's line breaks
                without rendering an actual <pre> tag (which carries a global
                dark code-block background meant for Blog's rich-text output) */}
            <Text
                whiteSpace={'pre-wrap'} textAlign={'justify'}
                fontFamily={'var(--font-outfit)'} color={'#d0d0d0'} lineHeight={1.8} fontSize={'md'}
            >
                {project.htmlContent}
            </Text>

            <Heading size={'sm'} fontFamily={'var(--font-outfit)'} fontWeight={600} color={'#faf9ff'} mt={8} mb={4}>
                User Interface (UI)
            </Heading>
            <Box
                id='image'
                sx={{
                    display: 'flex', flexWrap: 'wrap', gap: '12px',
                    '& img': {
                        width: '160px', height: '160px', objectFit: 'cover',
                        borderRadius: '12px', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
                        transition: 'transform 0.2s ease',
                    },
                    '& img:hover': { transform: 'scale(1.05)' },
                }}
                dangerouslySetInnerHTML={{ __html: project.htmlImage }}
            />
        </Box>
    )
}

export default ProjectDetail
