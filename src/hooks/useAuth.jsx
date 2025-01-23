import { useState, useEffect } from 'react';
import { PostAuth } from '../api/Coretify/POST';

/**
 * Custom hook to check if the user is authenticated.
 * 
 * @param {string} token - The authentication token to validate.
 * @returns {object} - Contains `isAuthenticated` (boolean), `isLoading` (boolean), and `error` (string or null).
 */
export function useAuth(token) {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially set to null to handle loading state
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // We start by loading

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsAuthenticated(false); // No token means no auth
                setIsLoading(false);
                return;
            }

            try {
                const data = await PostAuth(token);

                if (data.message === "Token is valid") {
                    setIsAuthenticated(true);
                    setError(null); // Clear error if auth is successful
                } else {
                    setIsAuthenticated(false);
                    setError("Access denied: Invalid or expired token.");
                }
            } catch (error) {
                console.error(error);
                setError(`An error occurred: ${error.message}`);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [token]);

    return { isAuthenticated, isLoading, error };
}
