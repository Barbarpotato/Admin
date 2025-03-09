// Core modules
import { Fragment } from 'react'
import { Button, Flex, Text, Spacer } from '@chakra-ui/react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Context
import { useGlobalContext } from '../contexts/GlobalContext';
import { p } from 'framer-motion/client';


function Pagination({ paginationData = [{ lastPage: 0, currentPage: 0 }] }) {

    // validate the pagination data
    if (!paginationData) {
        throw new Error('No pagination data provided');
    }

    if (!paginationData.current_page) {
        throw new Error('No current page provided');
    }

    if (!paginationData.last_page) {
        throw new Error('No last page provided');
    }

    const { pageNumber, setPageNumber } = useGlobalContext();

    return (
        <Fragment>

            <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                <Spacer />
                <Button size={{ base: 'xs', 'md': 'sm' }} mr={4} colorScheme='purple' isDisabled={pageNumber === 1}
                    onClick={() => setPageNumber(prev => prev - 1)}><IoIosArrowBack /></Button>
                <Text>
                    Page {paginationData.current_page} of {paginationData.last_page}
                </Text>
                <Button size={{ base: 'xs', 'md': 'sm' }} ml={4} colorScheme='purple'
                    isDisabled={pageNumber === paginationData.last_page}
                    onClick={() => setPageNumber(prev => prev + 1)}><IoIosArrowForward /></Button>
            </Flex>

        </Fragment>
    )
}

export default Pagination