// Core Modules
import { Fragment } from 'react'


// Custom Modules
import { useDataContact } from '../../api/contact/GET'

// Chakra UI
import { Box, List, ListItem, Text, Alert, AlertIcon, Divider, useToast } from '@chakra-ui/react'

// Custom Components
import Loading from '../../components/Loading'

// Api
import { deleteContact } from '../../api/contact/DELETE'


function Contact({ token }) {

    const toast = useToast();

    const { data, isLoading, isError, refetch } = useDataContact(token);

    if (isLoading) return <Loading />;
    if (isError) {
        return (
            <Alert status='danger'>
                <AlertIcon />
                <Text fontSize={'md'} color={'black'}>Something went wrong.</Text>
            </Alert>
        );
    }

    const handleRemoveMessage = async (id) => {
        try {
            // calling the api from contact DELETE  
            await deleteContact(id, token);
            toast({
                title: 'Message removed',
                description: 'The message has been removed from the list.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            // reinvoke the query
            refetch();
        } catch (error) {
            toast({
                title: 'Error removing message',
                description: error.message,
                status: 'error',
            })
        }
    }

    return (
        <Box p={5}>
            {data.length === 0 ? (
                <Alert status='warning'>
                    <AlertIcon />
                    <Text fontSize={'md'} color={'black'}>No Notifications Found.</Text>
                </Alert>
            ) : (
                <List spacing={3}>
                    {data.map(notification => (
                        <Fragment key={notification.id}>
                            <ListItem p={3} borderRadius="md" display="flex" flexDirection={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
                                <Box flex="1" mb={{ base: 2, md: 0 }}>
                                    <Text fontSize={{ base: 'xs', md: 'md' }} as="span" fontWeight="bold">[{notification.name}]</Text>
                                    <Text fontSize={{ base: 'xs', md: 'md' }} ml={2} as="span" fontWeight="bold">{notification.timestamp ? "[" + notification.timestamp + "]" : ""}</Text>
                                    <Text fontSize={{ base: 'xs', md: 'md' }} as="span" ml={2}>{notification.message}</Text>
                                </Box>
                                <Text onClick={() => handleRemoveMessage(notification.id)}
                                    fontSize={{ base: 'xs', md: 'md' }}
                                    as="span" color="purple.500" cursor="pointer" mt={{ base: 2, md: 0 }} ml={{ md: 3 }}>Remove</Text>
                            </ListItem>
                            <Divider />
                        </Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default Contact