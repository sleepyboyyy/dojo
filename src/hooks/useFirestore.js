import {useEffect, useReducer, useState} from "react";
import {projectFirestore, timestamp} from "../firebase/config";

let initialState = {
    document: null,
    isPending: false,
    success: null,
    error: null
}

const firestoreReducer = (state, action) => {
    switch(action.type) {
        case 'IS_PENDING':
            return {document: null, isPending: true, success: false, error: null}
        case 'ERROR':
            return {document: null, isPending: false, success: false, error: action.payload}
        case 'ADDED_DOCUMENT':
            return {document: action.payload, isPending: false, success: true, error: null}
        case 'DELETED_DOCUMENT':
            return {document: null, isPending: false, success: true, error: null}
        case 'UPDATED_DOCUMENT':
            return {document: action.payload, isPending: false, success: true, error: null}
        default:
            return state;
    }
}

export const useFirestore = (collection) => {
    // State
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    const [isCancelled, setIsCancelled] = useState(false);

    // get database (collection) ref
    const ref = projectFirestore.collection(collection);

    // dispatch helper cleanup function
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    }

    // ADD DOCUMENT FUNC
    const addDocument = async (doc) => {
        // manage isPending
        dispatch({ type: 'IS_PENDING' });

        try {
            // get timestamp
            const createdAt = timestamp.fromDate(new Date());
            // add to collection
            const addedDocument = await ref.add({ ...doc, createdAt });
            // manage cleanup dispatch
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
        }
        catch(err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }

    }

    // DELETE DOCUMENT FUNC
    const deleteDocument = async (id) => {
        // manage isPending
        dispatch({ type: 'IS_PENDING' });

        try {
            // delete doc with id
            await ref.doc(id).delete();

            // manage cleanup dispatch
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
        }
        catch(err) {
            // manage cleanup dispatch
            dispatchIfNotCancelled({ type: 'ERROR', payload: 'Could not delete item' })
        }
    }

    // update document
    const updateDocument = async (id, updates) => {
        dispatch({ type: 'IS_PENDING' });

        try {
            const updatedDocument = await ref.doc(id).update(updates);
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument });
            return updatedDocument;
        }
        catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            return null;
        }
    }

    // CLEANUP FUNCTION
    useEffect(() => {
        return () => setIsCancelled(true);
    }, [])

    return { addDocument, deleteDocument, updateDocument ,response }
}