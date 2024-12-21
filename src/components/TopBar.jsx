import {
    Spacer, Avatar, WrapItem, Flex, Popover, PopoverTrigger,
    PopoverContent, PopoverHeader, PopoverBody,
    PopoverArrow, PopoverCloseButton, Button,
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    Heading
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react'

function TopBar() {

    const location = useLocation()

    const locationSegments = location.pathname.split('/').filter(Boolean); // Filter out empty strings

    // function to split string uppercase with whitespace
    const splitString = (str) => str.replace(/([a-z])([A-Z])/g, '$1 $2');

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <Flex p={3} boxShadow={'2xl'} alignItems={'center'}>
            <Breadcrumb>
                {
                    locationSegments.length === 0 &&
                    <BreadcrumbItem>
                        <BreadcrumbLink color={'#ff79c6'} onClick={() => navigate('/')}>
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                }

                {
                    locationSegments.length > 0 &&
                    locationSegments.map((segment, index) => {
                        // Create the full path up to the current segment
                        const pathToSegment = `/${locationSegments.slice(0, index + 1).join('/')}`;

                        return (
                            <BreadcrumbItem key={index}>
                                <BreadcrumbLink color={'#ff79c6'} onClick={() => navigate(pathToSegment)}>
                                    <Heading size={"md"}>
                                        {splitString(segment)}
                                    </Heading>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        );
                    })
                }

            </Breadcrumb>
            <Spacer />
            <WrapItem >
                <Popover>
                    <PopoverTrigger>
                        <Avatar
                            cursor={'pointer'} name='Darmawan'
                            src='https://raw.githubusercontent.com/Barbarpotato/barbarpotato.github.io/c567a034bac07cae94577428a808e5af7513be4a/public/Avatar.svg' />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Do you want to Logout?</PopoverHeader>
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