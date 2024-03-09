import {useEffect, useState} from "react";
import {projectAuth, projectFirestore} from "../firebase/config";
import {useAuthContext} from "./useAuthContext";

export const useLogin = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);

    // Context
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsPending(true);
        setError(null);

        try {
            // Login user
            const res = await projectAuth.signInWithEmailAndPassword(email, password);
            dispatch({ type: 'LOGIN', payload: res.user });

            // Update user online status
            await projectFirestore.collection('users')
                .doc(res.user.uid)
                .update({
                    online: true
                })

            // Manage state wrapping in cleanup func.
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        }
        catch (err) {
            // Manage state wrapping in cleanup func.
            if (!isCancelled) {
                setIsPending(false);
                setError(err.message);
                console.log(err.message);
            }
        }
    }

    // CLEANUP FUNCTION
    useEffect(() => {
        return () => setIsCancelled(true);
    }, [])

    return { login, error, isPending }
}