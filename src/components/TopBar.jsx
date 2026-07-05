import {
    Spacer, Avatar, WrapItem, Flex, Popover, PopoverTrigger,
    PopoverContent, PopoverHeader, PopoverBody,
    PopoverArrow, PopoverCloseButton, Button,
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    Heading
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom';

// Maps a pathname to its breadcrumb trail (ancestors first, current page last).
// Needed because pages like ProjectDetail/PreviewProject aren't nested routes
// under ProjectOverview/AddProject, so the trail can't be derived from the URL alone.
function getBreadcrumbTrail(pathname) {
    if (pathname === '/') return [{ label: 'Dashboard', path: '/' }];
    if (pathname === '/ProjectOverview') return [{ label: 'Project Overview', path: '/ProjectOverview' }];
    if (pathname === '/ImageProject') return [{ label: 'Image Project', path: '/ImageProject' }];
    if (pathname === '/AddProject') return [{ label: 'Add Project', path: '/AddProject' }];
    if (pathname === '/PreviewProject') return [
        { label: 'Add Project', path: '/AddProject' },
        { label: 'Preview', path: '/PreviewProject' },
    ];
    if (pathname === '/ProjectDetail') return [
        { label: 'Project Overview', path: '/ProjectOverview' },
        { label: 'Detail', path: '/ProjectDetail' },
    ];
    if (pathname === '/Blog') return [{ label: 'Blog', path: '/Blog' }];
    if (pathname === '/ImageBlog') return [{ label: 'Image Blog', path: '/ImageBlog' }];
    if (pathname === '/AddBlog') return [{ label: 'Add Blog', path: '/AddBlog' }];
    if (pathname === '/PreviewBlog') return [
        { label: 'Add Blog', path: '/AddBlog' },
        { label: 'Preview', path: '/PreviewBlog' },
    ];
    if (pathname.startsWith('/BlogDetail/')) return [
        { label: 'Blog', path: '/Blog' },
        { label: 'Detail', path: pathname },
    ];

    // ** fallback: single segment, split on camelCase (e.g. "SomePage" -> "Some Page")
    const lastSegment = pathname.split('/').filter(Boolean).pop() || 'Dashboard';
    return [{ label: lastSegment.replace(/([a-z])([A-Z])/g, '$1 $2'), path: pathname }];
}

function TopBar() {

    const location = useLocation()
    const navigate = useNavigate()

    const trail = getBreadcrumbTrail(location.pathname);

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <Flex p={3} boxShadow={'2xl'} alignItems={'center'} bg={'#292b37'} position={'sticky'} top={0} zIndex={20}>
            <Breadcrumb>
                {trail.map((item, index) => {
                    const isCurrentPage = index === trail.length - 1;
                    return (
                        <BreadcrumbItem key={item.path} isCurrentPage={isCurrentPage}>
                            <BreadcrumbLink
                                color={isCurrentPage ? '#faf9ff' : '#866bab'}
                                _hover={isCurrentPage ? {} : { color: '#cc7bc9' }}
                                cursor={isCurrentPage ? 'default' : 'pointer'}
                                onClick={isCurrentPage ? undefined : () => navigate(item.path)}
                            >
                                <Heading size={"md"} fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={700} color={'#faf9ff'}>
                                    {item.label}
                                </Heading>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    );
                })}
            </Breadcrumb>
            <Spacer />
            <WrapItem ml={5}>
                <Popover>
                    <PopoverTrigger>
                        <Avatar
                            size={'md'}
                            className='icon'
                            cursor={'pointer'} name='Darmawan'
                            border={'2px solid #866bab'}
                            src='https://raw.githubusercontent.com/Barbarpotato/barbarpotato.github.io/c567a034bac07cae94577428a808e5af7513be4a/public/Avatar.svg' />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontFamily={'var(--font-outfit)'}>Do you want to Logout?</PopoverHeader>
                        <PopoverBody>
                            <Button onClick={handleLogout} colorScheme='gray' width={'100 % '} size={'sm'} mr={3}>Logout</Button>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </WrapItem>
        </Flex >
    )
}

export default TopBar
