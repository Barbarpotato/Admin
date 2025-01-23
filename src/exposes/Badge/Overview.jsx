import { useToast, useDisclosure, Flex, Box, Heading, Text, Avatar } from '@chakra-ui/react';
import Loading from '../../components/Loading.jsx';
import React, { Fragment, useState } from 'react'
import { useBadgesData } from '../../api/Hecate/GET';
import { DeleteBadge } from '../../api/Hecate/DELETE.js';
import CustomTable from '../../components/Table.jsx';
import CustomModal from '../../components/Modal.jsx';
import "../../index.css"

function BadgeOverview({ token }) {


    // ** internal state
    const [badge, setBadge] = useState({});

    const { data: badges, isLoading, isError, refetch } = useBadgesData();

    // ** chakra staff
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    if (isLoading) return <Loading />
    if (isError) return 'Error loading badges';

    const ActionListTable = [
        {
            label: "Copy to Add Site",
            onClick: async (badge_id) => {
                try {
                    const badge_data = badges.find((badge) => badge.id === badge_id)

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
                    const badge_data = badges.find((badge) => badge.id === badge_id)
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

            <CustomTable ColumnNames={["#", 'id', 'title', 'company_name', 'date', 'action']} Rows={badges}
                RowsAttr={["number", "id", "title", "company_name", "date"]}
                KeyAction={"id"} ActionList={ActionListTable} />

        </Fragment>
    )
}

export default BadgeOverview