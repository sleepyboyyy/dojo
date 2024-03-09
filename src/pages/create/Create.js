// styles
import './Create.css'

// React
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import Select from "react-select";
import {useCollection} from "../../hooks/useCollection";
import {timestamp} from "../../firebase/config";
import {useAuthContext} from "../../hooks/useAuthContext";
import {useFirestore} from "../../hooks/useFirestore";

const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
]

function Create() {
    // Destructured elements

    // destructure users documents
    const { documents } = useCollection('users');
    // destructure auth user
    const { user } = useAuthContext();
    // destructure useFirestore
    const { addDocument, response } = useFirestore('projects');

    // Users state
    const [users, setUsers] = useState([]);

    // handle users state
    useEffect(() => {
        if (documents) {
            setUsers(documents.map(user => {
                return { value: user, label: user.displayName }
            }))
        }

    }, [documents])

    // Form state
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');
    const [assignedUsers, setAssignedUsers] = useState([]);

    // Form error state
    const [formError, setFormError] = useState(null);

    // Setup useNavigate
    const navigate = useNavigate();

    // Handlers

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        // Handle form errors (required category and assignedUsers selection)
        if (!category) {
            setFormError('Please select a project category')
            return
        }

        if (assignedUsers.length < 1) {
            setFormError('Please assign the project to at least 1 user')
            return
        }

        // Data cleanup

        // cleanup a createdBy object
        const createdBy = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: user.uid,
        }

        // cleanup a assignedUsersList object
        const assignedUsersList = assignedUsers.map((u) => {
            return {
                displayName: u.value.displayName,
                photoURL: u.value.photoURL,
                id: u.value.id,
            }
        })

        // create the final object that is to be stored
        const project = {
            name,
            details,
            category: category.value,
            dueDate: timestamp.fromDate(new Date(dueDate)),
            comments: [],
            createdBy,
            assignedUsersList,
        }

        // add final project
        await addDocument(project);

        // handle redirect if no error
        if (!response.error) {
            navigate("/");
        }
    }

    return (
        <div className="create-form">
            <h2 className="page-title">Create a new project</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Project Name:</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </label>
                <label>
                    <span>Project Details:</span>
                    <textarea
                        required
                        onChange={(e) => setDetails(e.target.value)}
                        value={details}
                    ></textarea>
                </label>
                <label>
                    <span>Set due date:</span>
                    <input
                        required
                        type="date"
                        onChange={(e) => setDueDate(e.target.value)}
                        value={dueDate}
                    />
                </label>
                <label>
                    <span>Project Category:</span>
                    <Select
                        onChange={(option) => setCategory(option)}
                        options={categories}
                    />
                </label>
                <label>
                    <span>Assign To:</span>
                    <Select
                        options={users}
                        onChange={(option) => setAssignedUsers(option)}
                        isMulti
                    />
                </label>

                <button className="btn">Add Project</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
}

export default Create;