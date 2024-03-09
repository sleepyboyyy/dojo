import {useEffect, useState} from "react";
import {projectFirestore} from "../firebase/config";

export const useDocument = (collection, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    // realtime data for document
    useEffect(() => {
        // get document ref
        const ref = projectFirestore.collection(collection).doc(id)

        // update document state
        const unsub = ref.onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setDocument({ ...snapshot.data(), id: snapshot.id })
                setError(null)
            }
            else {
                setError('no such document exists')
            }
        }, (err) => {
            setError('failed to get document');
            console.log(err.message);
        })

        return () => unsub();

    }, [collection, id])

    return { document, error }
}