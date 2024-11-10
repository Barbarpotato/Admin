import {
    Button, useDisclosure, Drawer, DrawerBody, Box, DrawerHeader,
    DrawerOverlay, DrawerContent, DrawerCloseButton, Text, Heading,
} from '@chakra-ui/react'
import { IconContext } from 'react-icons';
import { FaAngleDoubleRight } from "react-icons/fa";
import { useRef, Fragment } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function SideBar() {

    const location = useLocation()
    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const NavButton = useRef()

    const handleLinkClick = (routeName, onCloseDrawer) => {
        navigate(routeName)
        onCloseDrawer()
    }

    const activeLink = {
        color: '#ff79c6',
        fontWeight: 'bold',
        textDecoration: 'underline',
    }

    return (
        <Fragment>
            <Button backgroundColor={'#ff79c6'} colorScheme='pink'
                position="fixed" top="85%" left="-4" height={"60px"} onClick={onOpen} >
                <IconContext.Provider value={{ size: "20", color: "#292b37" }}>
                    <FaAngleDoubleRight />
                </IconContext.Provider>
            </Button>
            <Drawer
                colorScheme={'blackAlpha'}
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={NavButton}>

                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader color={'#ff79c6'}>Hello, Darmawan</DrawerHeader>

                    <DrawerBody>
                        <Box>
                            <Heading py={2} size={'md'}>Dashboard</Heading>
                            <Box paddingLeft={'20px'}>
                                <Text onClick={() => handleLinkClick('/', onClose)}
                                    style={location.pathname === '/' ? activeLink : {}}
                                    className="nav-link" py={2}>Overview</Text>
                            </Box>
                        </Box>

                        <Box>
                            <Heading py={2} size={'md'}>Main page</Heading>
                            <Box paddingLeft={'20px'}>
                                <Text onClick={() => handleLinkClick('/Introduction', onClose)}
                                    style={location.pathname === '/Introduction' ? activeLink : {}}
                                    className="nav-link" py={2}>Introduction</Text>
                                <Text onClick={() => handleLinkClick('/Projects', onClose)}
                                    className="nav-link" py={2}
                                    style={location.pathname === '/Projects' ? activeLink : {}}
                                >Projects</Text>
                            </Box>
                        </Box>

                        <Box>
                            <Heading py={2} size={'md'}>Blog Site</Heading>
                            <Box paddingLeft={'20px'}>
                                <Text onClick={() => handleLinkClick('/Blog', onClose)}
                                    style={location.pathname === '/Blog' ? activeLink : {}}
                                    className="nav-link" py={2}>Overview</Text>
                                <Text onClick={() => handleLinkClick('/AddBlog', onClose)}
                                    style={location.pathname === '/addBlog' ? activeLink : {}}
                                    className="nav-link" py={2}>Add Blog</Text>
                            </Box>
                        </Box>


                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Fragment>
    )
}

export default SideBar