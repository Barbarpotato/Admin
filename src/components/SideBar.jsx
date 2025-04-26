import {
    useDisclosure, Drawer, DrawerBody, Box, DrawerHeader,
    DrawerOverlay, DrawerContent, DrawerCloseButton, Text, Heading,
} from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../contexts/GlobalContext';

// Define navigation structure
const navItems = [
    {
        section: 'Dashboard',
        links: [
            { label: 'Deployments', path: '/' }
        ],
    },
    {
        section: 'Project',
        links: [
            { label: 'Overview', path: '/ProjectOverview' },
            { label: 'Image Project', path: '/ImageProject' },
            { label: 'Add Project', path: '/AddProject' },
        ],
    },
    {
        section: 'Blog Site',
        links: [
            { label: 'Overview', path: '/Blog' },
            { label: 'Image Blog', path: '/ImageBlog' },
            { label: 'Add Blog', path: '/AddBlog' },
        ],
    },
    {
        section: 'Badge Site',
        links: [
            { label: 'Overview', path: '/Badge' },
            { label: 'Add Badge', path: '/AddBadge' },
        ],
    },
];

function SideBar() {

    const { resetState } = useGlobalContext();

    const location = useLocation();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const NavButton = useRef();

    const handleLinkClick = (routeName) => {
        resetState();
        navigate(routeName);
        onClose();
    };

    const activeLink = {
        color: '#ff79c6',
        fontWeight: 'bold',
        textDecoration: 'underline',
    };

    return (
        <Fragment>
            <button className="sidebar-toggle-button" onClick={onOpen}>
                <IconContext.Provider value={{ size: "20", color: "#292b37" }}>
                    <GiHamburgerMenu />
                </IconContext.Provider>
            </button>
            <Drawer
                colorScheme={'blackAlpha'}
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={NavButton}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader color={'#ff79c6'} fontWeight={'bold'}>Hello, Darmawan</DrawerHeader>

                    <DrawerBody>
                        {navItems.map((item, index) => (
                            <Box key={index} mb={4}>
                                <Heading py={2} size={'sm'}>{item.section}</Heading>
                                <Box paddingLeft={'20px'}>
                                    {item.links.map((link) => (
                                        <Text
                                            key={link.path}
                                            onClick={() => handleLinkClick(link.path)}
                                            style={location.pathname === link.path ? activeLink : {}}
                                            className="nav-link"
                                            py={2}
                                            cursor="pointer"
                                        >
                                            {link.label}
                                        </Text>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Fragment>
    );
}

export default SideBar;