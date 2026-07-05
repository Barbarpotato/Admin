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
            { label: 'Dashboard', path: '/' }
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
];

function NavLinks({ onNavigate, mobile = false }) {
    const location = useLocation();

    return (
        <Fragment>
            {navItems.map((item, index) => {
                // Sections with a single link (e.g. Dashboard) collapse into one
                // clickable heading instead of a heading + redundant sub-link.
                if (item.links.length === 1) {
                    const [link] = item.links;
                    const isActive = location.pathname === link.path;
                    return (
                        <Box key={index} mb={4}>
                            <Heading
                                py={2} size={'sm'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'}
                                onClick={() => onNavigate(link.path)}
                                className={`sidebar-nav-link ${mobile ? 'mobile' : ''} ${isActive ? 'active' : ''}`}
                            >
                                {item.section}
                            </Heading>
                        </Box>
                    );
                }

                return (
                    <Box key={index} mb={4}>
                        <Heading py={2} size={'sm'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} color={'#faf9ff'}>
                            {item.section}
                        </Heading>
                        <Box paddingLeft={'8px'}>
                            {item.links.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Text
                                        key={link.path}
                                        onClick={() => onNavigate(link.path)}
                                        className={`sidebar-nav-link ${mobile ? 'mobile' : ''} ${isActive ? 'active' : ''}`}
                                    >
                                        {link.label}
                                    </Text>
                                );
                            })}
                        </Box>
                    </Box>
                );
            })}
        </Fragment>
    );
}

function SideBar() {

    const { resetState } = useGlobalContext();

    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const NavButton = useRef();

    const handleLinkClick = (routeName) => {
        resetState();
        navigate(routeName);
        onClose();
    };

    return (
        <Fragment>
            {/* Persistent sidebar - desktop only */}
            <Box
                display={{ base: 'none', md: 'block' }}
                position={'sticky'}
                top={0}
                w={'260px'}
                flexShrink={0}
                h={'100vh'}
                overflowY={'auto'}
                bg={'#292b37'}
                borderRight={'1px solid rgba(134, 107, 171, 0.3)'}
                px={4}
                py={5}
            >
                <Heading size={'md'} mb={6} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={800} color={'#cc7bc9'}>
                    Hello, Darmawan
                </Heading>
                <NavLinks onNavigate={handleLinkClick} />
            </Box>

            {/* Hamburger + drawer - mobile only */}
            <Box display={{ base: 'block', md: 'none' }}>
                <button className="sidebar-toggle-button" onClick={onOpen}>
                    <IconContext.Provider value={{ size: "20", color: "#faf9ff" }}>
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
                        <DrawerHeader color={'#cc7bc9'} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={800}>
                            Hello, Darmawan
                        </DrawerHeader>

                        <DrawerBody>
                            <NavLinks onNavigate={handleLinkClick} mobile />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Box>
        </Fragment>
    );
}

export default SideBar;
