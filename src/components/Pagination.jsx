// Core modules
import { Fragment } from 'react'
import { Button, Flex, Text, Spacer } from '@chakra-ui/react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Context
import { useGlobalContext } from '../contexts/GlobalContext';


function Pagination({ paginationData }) {

    const { pageNumber, setPageNumber } = useGlobalContext();

    // ** fall back gracefully instead of crashing the page when data hasn't
    // ** arrived yet or the backend omits pagination metadata (e.g. empty result set)
    const currentPage = paginationData?.current_page ?? pageNumber ?? 1;
    const lastPage = paginationData?.last_page ?? currentPage;

    return (
        <Fragment>

            <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                <Spacer />
                <Button size={{ base: 'xs', 'md': 'sm' }} mr={4} colorScheme='purple' isDisabled={currentPage <= 1}
                    onClick={() => setPageNumber(prev => prev - 1)}><IoIosArrowBack /></Button>
                <Text>
                    Page {currentPage} of {lastPage}
                </Text>
                <Button size={{ base: 'xs', 'md': 'sm' }} ml={4} colorScheme='purple'
                    isDisabled={currentPage >= lastPage}
                    onClick={() => setPageNumber(prev => prev + 1)}><IoIosArrowForward /></Button>
            </Flex>

        </Fragment>
    )
}

export default Pagination