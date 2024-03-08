import {useEffect, useState} from "react";
import {useAuthContext} from "./useAuthContext";
import {projectAuth} from "../firebase/config";

export const useLogout = () => {
    // State
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);

    // Context
    const { dispatch } = useAuthContext();

    const logout = async () => {
        setIsPending(true);
        setError(null);

        try {
            // logout and dispatch for context
            await projectAuth.signOut();
            dispatch({ type: 'LOGOUT' })

            // manage state wrapping in cleanup func
            if(!isCancelled) {
                setError(null);
                setIsPending(false);
            }
        }

        catch (err) {
            // manage state wrapping in cleanup func
            if(!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setIsPending(false);
            }
        }
    }

    // CLEANUP FUNCTION
    useEffect(() => {
        return () => setIsCancelled(true);
    }, [])

    return { logout, error, isPending }
}