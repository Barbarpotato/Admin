// context/MyContext.js
import { createContext, useContext, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';


// Create the context with a default value
const GlobalContext = createContext();


export const GlobalContextProvider = ({ children }) => {

    // ** Global State For Table View
    const [dataTable, setDataTable] = useState({});
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParams, setSearchParams] = useState({});

    // ** Modal Component
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ** Toast Component
    const toast = useToast();

    // ** Function to reset state
    const resetState = () => {
        setDataTable({});
        setPageNumber(1);
        setSearchParams({});
    };

    const contextValue = {
        dataTable, setDataTable,
        pageNumber, setPageNumber,
        searchParams, setSearchParams,
        isOpen, onOpen, onClose, toast,
        resetState
    };

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);