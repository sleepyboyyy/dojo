import {useEffect, useRef, useState} from "react";
import {projectFirestore} from "../firebase/config";


export const useCollection = (collection, _query, _orderBy) => {
    //State
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    //Ref handling
    const query = useRef(_query).current;
    const orderBy = useRef(_orderBy).current;

    useEffect(() => {
        // get ref
        let ref = projectFirestore.collection(collection);

        // Check for query
        if (query) {
            ref = ref.where( ...query );
        }

        // Check for data order (orderBy)
        if (orderBy) {
            ref = ref.orderBy( ...orderBy );
        }

        // Grab snapshot
        const unsub = ref.onSnapshot(snapshot => {
            // Initialize results for content
            let result = [];

            // Grab documents from snapshot and push to result
            snapshot.docs.forEach(doc => {
                result.push({ ...doc.data(), id: doc.id })
            })

            // Manage state
            setDocuments(result);
            setError(null);

        }, error => { // Handle error
            setError('Could not fetch data')
            console.log(error);
        })

        // CLEANUP FUNCTION (unsub on unmount)
        return () => unsub();

    }, [collection, query, orderBy])

    return { documents, error }
}