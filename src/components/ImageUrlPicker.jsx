// Core Modules
import { useEffect, useState } from 'react'
import { Box, Input, Grid, Image, Text, Spinner } from '@chakra-ui/react'

// API Modules
import { fetchFiles } from '../api/storage/GET'

const isUrl = (value) => /^https?:\/\//i.test(value || '');

/**
 * An Image URL input that doubles as a live search box against the already
 * uploaded images in `folder` (Project/Blog storage). Typing shows matching
 * thumbnails below the field; clicking one fills the field with that image's URL.
 * Pasting a full URL directly still works exactly like a plain input.
 */
function ImageUrlPicker({ folder, token, value, onChange, onSelect, placeholder = 'Image URL' }) {

    const [debouncedValue, setDebouncedValue] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), 500);
        return () => clearTimeout(handler);
    }, [value]);

    useEffect(() => {
        // ** skip searching once the field already holds a full URL (just selected/pasted)
        if (!debouncedValue || !token || isUrl(debouncedValue)) {
            setResults([]);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        fetchFiles({ folder, search: debouncedValue, token, limit: 8 })
            .then((res) => {
                if (!cancelled) setResults((res.files || []).filter((f) => f.name));
            })
            .catch(() => {
                if (!cancelled) setResults([]);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [debouncedValue, folder, token]);

    const handleSelect = (image) => {
        onChange(image.url);
        onSelect?.(image);
        setResults([]);
        setIsFocused(false);
    };

    const showDropdown = isFocused && !isUrl(value) && (isLoading || results.length > 0);

    return (
        <Box position="relative">
            <Input
                borderRadius={'2xl'} size={'lg'} borderWidth={2} colorScheme='purple'
                borderColor={'#866bab'} focusBorderColor={'#cc7bc9'} my={2}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            />

            {showDropdown && (
                <Box
                    position="absolute" zIndex={20} w="100%" top="100%"
                    bg={'#292b37'} border={'1px solid rgba(134, 107, 171, 0.3)'} borderRadius={'lg'}
                    mt={-1} p={2} maxH={'220px'} overflowY={'auto'} boxShadow={'lg'}
                >
                    {isLoading && <Spinner size="sm" color={'#866bab'} />}
                    {!isLoading && results.length === 0 && (
                        <Text fontSize={'sm'} color={'#c0c0c0'} px={1}>No matching images found.</Text>
                    )}
                    {!isLoading && results.length > 0 && (
                        <Grid templateColumns={'repeat(auto-fill, minmax(64px, 1fr))'} gap={2}>
                            {results.map((image, idx) => (
                                <Box
                                    key={idx} cursor={'pointer'} borderRadius={'md'} overflow={'hidden'}
                                    title={image.name}
                                    onClick={() => handleSelect(image)}
                                    _hover={{ boxShadow: '0 0 0 2px #cc7bc9' }}
                                >
                                    <Image src={image.url} alt={image.name} w="100%" h="64px" objectFit={'cover'} />
                                </Box>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default ImageUrlPicker
