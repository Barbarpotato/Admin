import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // State to store the value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Check if there is an existing value in localStorage
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage key:', key, error);
            return initialValue;
        }
    });

    // Function to update the value and sync it with localStorage
    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Update the state
            setStoredValue(valueToStore);
            // Update localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting localStorage key:', key, error);
        }
    };

    // Sync state with localStorage when the key changes
    // the data not always to be a json form
    useEffect(() => {
        const item = window.localStorage.getItem(key);
        if (item) {
            setStoredValue(JSON.parse(item));
        }
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
