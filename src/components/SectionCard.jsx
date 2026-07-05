// Core Modules
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

// Shared card wrapper so each part of a page reads as a distinct, scannable block
function SectionCard({ title, description, icon, children, ...rest }) {
    return (
        <Box bg={'#383a4a'} borderRadius={'xl'} boxShadow={'md'} p={6} mb={6} {...rest}>
            <Flex align={'center'} gap={2}>
                {icon && <Box color={'#cc7bc9'} fontSize={'lg'} aria-hidden="true">{icon}</Box>}
                <Heading size={'sm'} fontFamily={'var(--font-outfit)'} fontWeight={600} color={'#faf9ff'}>{title}</Heading>
            </Flex>
            {description && <Text fontSize={'sm'} color={'#c0c0c0'} mt={1} mb={4}>{description}</Text>}
            <Box mt={description ? 0 : 4}>
                {children}
            </Box>
        </Box>
    )
}

export default SectionCard
