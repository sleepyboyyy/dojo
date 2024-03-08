import {useEffect, useState} from "react";
import {projectAuth} from "../firebase/config";
import {useAuthContext} from "./useAuthContext";


export const useSignup = () => {
    // State
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);

    // Context
    const { dispatch } = useAuthContext();

    const signup = async (email, password, displayName) => {
        setIsPending(true);
        setError(null);

        try {
            // Create user
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)
            if (!res) {
                throw new Error ("could not sign user up");
            }

            // Update displayName
            await res.user.updateProfile(displayName);

            // Dispatch login
            dispatch({ type: 'LOGIN', user: res.user });

            // manage state wrapped with cleanup func
            if(!isCancelled) {
                setError(null);
                setIsPending(false);
            }
        }
        catch (err) {
            // manage state wrapped with cleanup func
            if(!isCancelled) {
                setError(err.message);
                setIsPending(false);
                console.log(err.message);
            }
        }
    }

    // CLEANUP FUNCTION
    useEffect(() => {
        return () => setIsCancelled(true);
    }, [])

    return { signup, error, isPending }
}