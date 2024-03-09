import {useEffect, useState} from "react";
import {projectAuth, projectFirestore, projectStorage} from "../firebase/config";
import {useAuthContext} from "./useAuthContext";

export const useSignup = () => {
    // State
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);

    // Context
    const { dispatch } = useAuthContext();

    const signup = async (email, password, displayName, thumbnail) => {
        setIsPending(true);
        setError(null);

        try {
            // Create user
            const res = await projectAuth.createUserWithEmailAndPassword(email, password);
            if (!res) {
                throw new Error ("could not sign user up");
            }

            // Upload user thumbnail to firebase storage
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
            const img = await projectStorage.ref(uploadPath).put(thumbnail);
            const imgUrl = await img.ref.getDownloadURL();

            // Update displayName
            await res.user.updateProfile({ displayName, photoURL: imgUrl });

            // create a user document
            await projectFirestore.collection('users').doc(res.user.uid).set({
                online: true,
                displayName,
                photoURL: imgUrl,
            })

            // Dispatch login
            dispatch({ type: 'LOGIN', payload: res.user });

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