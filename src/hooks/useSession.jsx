import { useState, useEffect } from "react";

const useSession = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading sessionStorage", error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));

            // Trigger storage event manually to update the state
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Error setting sessionStorage", error);
        }
    };

    // Update the state when sessionStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const item = window.sessionStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        };

        // Listen for changes in sessionStorage
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
};

export default useSession;
