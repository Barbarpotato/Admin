// context/MyContext.js
import { createContext, useContext, useEffect, useState } from 'react';
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

    const contextValue = {
        dataTable, setDataTable,
        pageNumber, setPageNumber,
        searchParams, setSearchParams,
        isOpen, onOpen, onClose, toast
    };

    // ** Reset the state when the component unmounts
    useEffect(() => {
        return () => {
            setDataTable({});
            setPageNumber(1);
            setSearchParams({});
        };
    }, []);

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);