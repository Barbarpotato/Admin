// Core Modules
import { Box, Heading, Text } from '@chakra-ui/react';

// Lightweight heading for grouping fields inside a single form card, so a long
// form reads as one page with sections rather than a stack of separate boxes.
function FormSection({ title, description, children }) {
    return (
        <Box>
            <Heading size={'sm'} fontFamily={'var(--font-outfit)'} fontWeight={600} color={'#faf9ff'}>{title}</Heading>
            {description && <Text fontSize={'sm'} color={'#c0c0c0'} mt={1} mb={4}>{description}</Text>}
            <Box mt={description ? 0 : 4}>
                {children}
            </Box>
        </Box>
    )
}

export default FormSection
