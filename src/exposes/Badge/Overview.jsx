// Core Modules
import { Flex, Box, Heading, Text, Avatar } from '@chakra-ui/react';
import { Fragment } from 'react'

// API Modules
import { useBadgesData } from '../../api/badges/GET';
import { DeleteBadge } from '../../api/badges/DELETE.js';

// Context
import { useGlobalContext } from '../../contexts/GlobalContext';

// Custom Components
import Search from '../../components/Search.jsx';
import CustomTable from '../../components/Table.jsx';
import Pagination from '../../components/Pagination.jsx';
import CustomModal from '../../components/Modal.jsx';
import Loading from '../../components/Loading.jsx';


function BadgeOverview({ token }) {

    // ** Global Context
    const { dataTable, setDataTable, pageNumber, searchParams,
        isOpen, onOpen, onClose, toast } = useGlobalContext();

    // ** React query api call
    const { data: badges, isLoading, isError, refetch } = useBadgesData(pageNumber, 8, searchParams.title);

    if (isLoading) return <Loading />
    if (isError) return 'Error loading badges';

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
                    setDataTable(badge_data)
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
                {dataTable && (
                    <Box>
                        <a href={dataTable.credential_url} target='_blank'>
                            <Heading _hover={{ cursor: 'pointer', textDecoration: 'underline' }}>{dataTable.title}</Heading>
                            <Flex mt={2} alignItems={'center'}>
                                <Avatar mr={3} src={dataTable.logo_url} />
                                <Text opacity={0.5}>{dataTable.date} - {dataTable.company_name}</Text>
                            </Flex>
                        </a>
                        <Text my={4}>
                            {dataTable.description}
                        </Text>
                    </Box>
                )}
            </CustomModal>

            <Search searchKey='title' />

            <CustomTable ColumnNames={['title', 'company_name', 'date', 'Badge ID', 'action']} Rows={badges.data}
                RowsAttr={["title", "company_name", "date", "badges_id"]}
                KeyAction={"badges_id"} ActionList={ActionListTable} />

            <Pagination paginationData={badges} />

        </Fragment>
    )
}

export default BadgeOverview