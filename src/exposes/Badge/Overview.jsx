// Core Modules
import {
    useToast, useDisclosure, Flex, Button,
    Box, Heading, Text, Avatar, Spacer, Input
} from '@chakra-ui/react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { Fragment, useState } from 'react'

// API Modules
import { useBadgesData } from '../../api/badges/GET';
import { DeleteBadge } from '../../api/badges/DELETE.js';

// Custom Components
import CustomTable from '../../components/Table.jsx';
import CustomModal from '../../components/Modal.jsx';
import Loading from '../../components/Loading.jsx';

// CSS
import "../../index.css"


function BadgeOverview({ token }) {


    // ** internal state
    const [badge, setBadge] = useState({});
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParams, setSearchParams] = useState({
        title: "",
    });

    const { data: badges, isLoading, isError, refetch } = useBadgesData(pageNumber, 8, searchParams.title);

    // ** chakra staff
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    if (isLoading) return <Loading />
    if (isError) return 'Error loading badges';

    const handleSearchQuery = (e) => {
        setPageNumber(1); // Reset to first page when searching
        setSearchParams({
            title: e.target.title.value
        });
    };

    const ActionListTable = [
        {
            label: "Copy to Add Site",
            onClick: async (badge_id) => {
                try {
                    const badge_data = badges.data.find((badge) => badge.badges_id === badge_id)

                    // re format date
                    const [month, day, year] = badge_data.date.split('/');

                    // Rearrange the format to day/month/year
                    const formattedDate = `${day}/${month}/${year}`;

                    // set to localstorage
                    window.localStorage.setItem('content-badge', JSON.stringify({
                        title: badge_data.title,
                        description: badge_data.description,
                        company_name: badge_data.company_name,
                        logo_url: badge_data.logo_url,
                        credential_url: badge_data.credential_url,
                        date: formattedDate
                    }))

                    toast({
                        title: `Copy Contnet to Add Site`,
                        status: "success",
                    })

                } catch (err) {
                    console.error(err)
                    toast({
                        title: `Something went wrong`,
                        status: "error",
                    })
                }
            }
        },
        {
            label: "Details",
            onClick: async (badge_id) => {
                try {
                    const badge_data = badges.data.find((badge) => badge.badges_id === badge_id)
                    setBadge(badge_data)
                    onOpen()
                } catch (err) {
                    console.error(err)
                    toast({
                        title: `Something went wrong`,
                        status: "error",
                    })
                }
            }
        },
        {
            label: "Delete",
            onClick: async (badge_id) => {
                try {
                    await DeleteBadge(badge_id, token)
                    refetch();
                    toast({
                        title: `Successfully deleted Badge Data`,
                        status: "success",
                    })
                } catch (err) {
                    console.error(err)
                    toast({
                        title: `Something went wrong`,
                        status: "error",
                    })
                }
            }
        }
    ]

    return (
        <Fragment>
            <CustomModal modalTitle='Badge Detail' modalSize='xl' isOpen={isOpen} onClose={onClose} >
                {badge && (
                    <Box>
                        <a href={badge.credential_url} target='_blank'>
                            <Heading _hover={{ cursor: 'pointer', textDecoration: 'underline' }}>{badge.title}</Heading>
                            <Flex mt={2} alignItems={'center'}>
                                <Avatar mr={3} src={badge.logo_url} />
                                <Text opacity={0.5}>{badge.date} - {badge.company_name}</Text>
                            </Flex>
                        </a>
                        <Text my={4}>
                            {badge.description}
                        </Text>
                    </Box>
                )}
            </CustomModal>

            <form onSubmit={handleSearchQuery}>
                <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                    <Spacer />
                    <Input width={{ base: '100%', lg: '25%' }} borderLeftRadius={'2xl'} borderRightRadius={0} size={'md'} borderWidth={3} colorScheme='purple' borderColor={"#536189"}
                        focusBorderColor={"#ff79c6"} placeholder='Search By title...' name='title' />
                    <Button borderLeftRadius={0} size={'md'} colorScheme='purple'
                        type='submit'>
                        Search
                    </Button>
                </Flex>
            </form>

            <CustomTable ColumnNames={['id', 'title', 'company_name', 'date', 'action']} Rows={badges.data}
                RowsAttr={["badges_id", "title", "company_name", "date"]}
                KeyAction={"badges_id"} ActionList={ActionListTable} />


            <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                <Spacer />
                <Button mr={4} colorScheme='purple' isDisabled={pageNumber === 1}
                    onClick={() => setPageNumber(prev => prev - 1)}><IoIosArrowBack /></Button>
                <Text>
                    Page {badges.current_page} of {badges.last_page}
                </Text>
                <Button ml={4} colorScheme='purple'
                    isDisabled={pageNumber === badges.last_page}
                    onClick={() => setPageNumber(prev => prev + 1)}><IoIosArrowForward /></Button>
            </Flex>


        </Fragment>
    )
}

export default BadgeOverview