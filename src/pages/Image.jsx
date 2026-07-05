// Core Modules
import {
    Button, Input, Flex, Text, Box, Grid, Image, Spinner, Checkbox,
    InputGroup, InputLeftElement, InputRightAddon, IconButton,
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay, useDisclosure
} from '@chakra-ui/react'
import { useRef, useState, useEffect } from 'react'
import { FiUploadCloud, FiSearch, FiExternalLink, FiTrash2, FiImage } from "react-icons/fi"

// API Modules
import { uploadFile } from '../api/storage/POST'
import { fetchFiles } from '../api/storage/GET'
import { deleteFile } from '../api/labs/DELETE'

// Context
import { useGlobalContext } from '../contexts/GlobalContext';

// ** strip characters that aren't safe in a filename/URL
const sanitizeFileName = (name) => name.replace(/[\/\\?%*:|"<>]/g, '-').trim();

function CustomImage({ token, sourceFolder }) {

    const { toast } = useGlobalContext();

    const fileInputRef = useRef(null);
    const sentinelRef = useRef(null);
    const cancelDeleteRef = useRef(null);

    const [images, setImages] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const [customFileName, setCustomFileName] = useState("");
    const [fileExtension, setFileExtension] = useState("");
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // ** client-side multi-select: a Set of selected image names
    const [selected, setSelected] = useState(new Set());

    // ** pending delete target, either { type: 'single', name } or { type: 'bulk', names }
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const fetchImages = async (pageToken = "", search = "", append = false) => {
        try {
            const response = await fetchFiles({ folder: `${sourceFolder}`, pageToken, search, token });
            setImages((prev) => append ? [...prev, ...(response.files || [])] : (response.files || []));
            setNextPageToken(response.nextPageToken);
        } catch (error) {
            toast({
                title: 'Failed to fetch images',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Failed to fetch images:', error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        fetchImages();
        setSelected(new Set());
    }, [sourceFolder]);

    // ** Infinite scroll: fetch the next page automatically once the sentinel
    // ** element at the bottom of the grid scrolls into view.
    useEffect(() => {
        const node = sentinelRef.current;
        if (!node || !nextPageToken) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && nextPageToken && !isFetchingMore) {
                setIsFetchingMore(true);
                fetchImages(nextPageToken, searchTerm, true);
            }
        }, { rootMargin: '200px' });

        observer.observe(node);
        return () => observer.disconnect();
    }, [nextPageToken, searchTerm, isFetchingMore]);

    const handleUpload = async () => {
        const file = fileInputRef.current.files[0];

        if (!file) {
            toast({
                title: 'No file selected',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('No file selected');
            return;
        }

        const finalFileName = customFileName.trim()
            ? `${sanitizeFileName(customFileName)}${fileExtension}`
            : file.name;

        try {
            await uploadFile(sourceFolder, file, token, finalFileName);
            toast({
                title: 'Image uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fileInputRef.current.value = '';
            setSelectedFileName("");
            setCustomFileName("");
            setFileExtension("");
            fetchImages(); // Refresh the image list after upload
        } catch (error) {
            toast({
                title: 'Upload failed',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Upload failed:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setSelected(new Set());
        fetchImages("", event.target.value);
    };

    const toggleSelect = (name) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name); else next.add(name);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelected((prev) => prev.size === images.length ? new Set() : new Set(images.map((img) => img.name)));
    };

    const requestDeleteSingle = (name) => {
        setDeleteTarget({ type: 'single', names: [name] });
        onDeleteOpen();
    };

    const requestDeleteSelected = () => {
        setDeleteTarget({ type: 'bulk', names: Array.from(selected) });
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        const names = deleteTarget?.names ?? [];
        try {
            await Promise.all(names.map((name) => deleteFile(sourceFolder, name, token)));
            toast({
                title: names.length > 1 ? `${names.length} images deleted` : 'Image deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setSelected((prev) => {
                const next = new Set(prev);
                names.forEach((name) => next.delete(name));
                return next;
            });
            fetchImages(); // Refresh the image list after deletion
        } catch (error) {
            toast({
                title: 'Delete failed',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Delete failed:', error);
        } finally {
            setDeleteTarget(null);
            onDeleteClose();
        }
    };

    return (
        <Flex direction="column" align="center" w="100%">
            {/* Upload dropzone */}
            <Flex
                direction="column" align="center" justify="center" w="100%" mb={6}
                border="2px dashed #866bab" borderRadius="xl" p={6}
                cursor="pointer" transition="all 0.2s ease"
                _hover={{ borderColor: '#cc7bc9', bg: 'rgba(134, 107, 171, 0.06)' }}
                onClick={() => fileInputRef.current?.click()}
            >
                <FiUploadCloud size={28} color="#866bab" />
                <Text mt={2} fontSize="sm" color="#c0c0c0" textAlign="center">
                    {selectedFileName || 'Click to choose an image'}
                </Text>
                <Input
                    ref={fileInputRef} type="file" accept="image/*" display="none"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFileName(file?.name || "");

                        if (!file) {
                            setCustomFileName("");
                            setFileExtension("");
                            return;
                        }

                        const dotIndex = file.name.lastIndexOf('.');
                        if (dotIndex > 0) {
                            setCustomFileName(file.name.slice(0, dotIndex));
                            setFileExtension(file.name.slice(dotIndex));
                        } else {
                            setCustomFileName(file.name);
                            setFileExtension("");
                        }
                    }}
                />

                {selectedFileName && (
                    <InputGroup size="sm" mt={3} maxW="280px" onClick={(e) => e.stopPropagation()}>
                        <Input
                            value={customFileName}
                            onChange={(e) => setCustomFileName(e.target.value)}
                            borderColor={'#866bab'} focusBorderColor={'#cc7bc9'}
                            bg={'#292b37'} borderRightRadius={fileExtension ? 0 : undefined}
                            placeholder="File name"
                        />
                        {fileExtension && (
                            <InputRightAddon bg={'#383a4a'} color={'#c0c0c0'} borderColor={'#866bab'}>
                                {fileExtension}
                            </InputRightAddon>
                        )}
                    </InputGroup>
                )}

                <Button
                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                    mt={4} size="sm" bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }}
                >
                    Upload Image
                </Button>
            </Flex>

            <Box position="sticky" top={{ base: '56px', md: '64px' }} zIndex={10} bg={'#292b37'} w="100%" pt={2} pb={3}>
                <Flex w="100%" align="center" gap={3} wrap={{ base: 'wrap', md: 'nowrap' }}>
                    <InputGroup flex={1} minW={{ base: '100%', md: '220px' }}>
                        <InputLeftElement pointerEvents='none' color={'#866bab'}>
                            <FiSearch />
                        </InputLeftElement>
                        <Input
                            size={'md'} borderWidth={2} colorScheme='purple' borderColor={"#866bab"}
                            placeholder="Search images..." focusBorderColor={"#cc7bc9"}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>

                    {images.length > 0 && (
                        <Flex align="center" gap={3} flexShrink={0} wrap="wrap">
                            <Checkbox
                                colorScheme="purple"
                                isChecked={selected.size > 0 && selected.size === images.length}
                                isIndeterminate={selected.size > 0 && selected.size < images.length}
                                onChange={toggleSelectAll}
                            >
                                <Text fontSize="sm" color={'#c0c0c0'}>Select all</Text>
                            </Checkbox>

                            {selected.size > 0 && (
                                <Flex align="center" gap={2} wrap="wrap">
                                    <Text fontSize="sm" color={'#faf9ff'}>{selected.size} selected</Text>
                                    <Button size="sm" leftIcon={<FiTrash2 />} colorScheme="red" onClick={requestDeleteSelected}>
                                        Delete Selected
                                    </Button>
                                    <Button size="sm" variant="ghost" color={'#c0c0c0'} onClick={() => setSelected(new Set())}>
                                        Clear
                                    </Button>
                                </Flex>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Box>

            <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} w="100%">
                {images.map((image, index) => {
                    if (image.name === "") return null;
                    const isChecked = selected.has(image.name);
                    return (
                        <Box
                            key={index} role="group" position="relative" bg={'#383a4a'} borderRadius={'xl'} overflow={'hidden'}
                            boxShadow={isChecked ? '0 0 0 2px #cc7bc9' : 'md'} transition={'all 0.2s ease'}
                            _hover={{ boxShadow: isChecked ? '0 0 0 2px #cc7bc9' : '0px 0px 20px rgba(204, 123, 201, 0.4)', transform: 'translateY(-2px)' }}
                        >
                            <Checkbox
                                position="absolute" top={2} left={2} zIndex={1}
                                bg="rgba(41, 43, 55, 0.7)" borderRadius="md" p={1}
                                colorScheme="purple"
                                isChecked={isChecked}
                                onChange={() => toggleSelect(image.name)}
                            />
                            <Box h={'120px'} overflow={'hidden'} bg={'#292b37'}>
                                <Image
                                    src={image.url} alt={image.name} w="100%" h="100%" objectFit="cover" loading="lazy"
                                    transition={'transform 0.3s ease'} _groupHover={{ transform: 'scale(1.08)' }}
                                    fallback={
                                        <Flex h="100%" align="center" justify="center" color={'#866bab'}>
                                            <FiImage size={28} />
                                        </Flex>
                                    }
                                />
                            </Box>
                            <Box p={3}>
                                <Text fontSize={'xs'} color={'#c0c0c0'} noOfLines={1} title={image.name}>
                                    {image.name}
                                </Text>
                                <Flex mt={2} justify={'space-between'}>
                                    <IconButton
                                        as="a" href={image.url} target="_blank" rel="noopener noreferrer"
                                        aria-label="View image" icon={<FiExternalLink />}
                                        size={'md'} fontSize={'lg'} variant={'ghost'} color={'#866bab'} _hover={{ color: '#cc7bc9', bg: 'rgba(134, 107, 171, 0.15)' }}
                                    />
                                    <IconButton
                                        aria-label="Delete image" icon={<FiTrash2 />}
                                        size={'md'} fontSize={'lg'} variant={'ghost'} colorScheme={'red'}
                                        onClick={() => requestDeleteSingle(image.name)}
                                    />
                                </Flex>
                            </Box>
                        </Box>
                    );
                })}
            </Grid>

            {/* Sentinel: once this scrolls into view, the next page loads automatically */}
            {nextPageToken && (
                <Flex ref={sentinelRef} mt={6} justify="center" w="100%">
                    {isFetchingMore && <Spinner size="sm" color={'#866bab'} />}
                </Flex>
            )}

            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelDeleteRef} onClose={onDeleteClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent bg={'#383a4a'} color={'#faf9ff'}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {deleteTarget?.type === 'bulk' ? 'Delete images' : 'Delete image'}
                        </AlertDialogHeader>

                        <AlertDialogBody color={'#c0c0c0'}>
                            {deleteTarget?.type === 'bulk'
                                ? `Are you sure you want to delete ${deleteTarget?.names?.length} selected image(s)? This cannot be undone.`
                                : `Are you sure you want to delete "${deleteTarget?.names?.[0]}"? This cannot be undone.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelDeleteRef} onClick={onDeleteClose} variant={'ghost'} color={'#c0c0c0'}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    );
}

export default CustomImage
