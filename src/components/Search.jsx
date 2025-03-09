// Core Modules
import { Fragment } from 'react'
import { Flex, Input, Button, Spacer } from '@chakra-ui/react'

// Context
import { useGlobalContext } from '../contexts/GlobalContext';


function Search({ searchKey = "" }) {

    const { setPageNumber, setSearchParams } = useGlobalContext();

    const handleSearchQuery = (e) => {
        e.preventDefault();
        setPageNumber(1); // Reset to first page when searching
        setSearchParams({
            [searchKey]: e.target[searchKey].value
        });
    };

    return (
        <Fragment>
            <form onSubmit={handleSearchQuery}>
                <Flex alignItems={'center'} my={8} justifyContent={'center'}>
                    <Spacer />
                    <Input width={{ base: '100%', lg: '25%' }} borderLeftRadius={'2xl'} borderRightRadius={0} size={'md'} borderWidth={3} colorScheme='purple' borderColor={"#536189"}
                        focusBorderColor={"#ff79c6"} placeholder={`search by ${searchKey}...`} name={searchKey} />
                    <Button borderLeftRadius={0} size={'md'} colorScheme='purple'
                        type='submit'>
                        Search
                    </Button>
                </Flex>
            </form>
        </Fragment>
    )
}

export default Search