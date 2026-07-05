// context/MyContext.js
import { createContext, useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react';


// Create the context with a default value
const GlobalContext = createContext();


export const GlobalContextProvider = ({ children }) => {

    // ** Global State For Table View
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParams, setSearchParams] = useState({});

    // ** Toast Component
    const toast = useToast();

    // ** Function to reset state
    const resetState = () => {
        setPageNumber(1);
        setSearchParams({});
    };

    const contextValue = {
        pageNumber, setPageNumber,
        searchParams, setSearchParams,
        toast,
        resetState
    };

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);
