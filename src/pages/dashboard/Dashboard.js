// styles
import './Dashboard.css'

// React
import { useCollection } from "../../hooks/useCollection";
import { useState } from "react";

// Components
import ProjectList from "../../components/ProjectList";
import ProjectFilter from "./ProjectFilter";
import {useAuthContext} from "../../hooks/useAuthContext";

function Dashboard() {
    // Destructuring

    // destructure collection
    const { documents, error } = useCollection('projects');
    // destructure auth user
    const { user } = useAuthContext();

    // Filter state
    const [currentFilter, setCurrentFilter] = useState('all');

    // Changing filter func
    const changeFilter = (newFilter) => setCurrentFilter(newFilter);

    // Filtering objects based on currentFilter (!!will run only if documents != null)
    const projects = documents ? documents.filter((document) => {
        switch (currentFilter) {
            case 'all':
                return true // return all

            case 'mine':
                let assignedToMe = false;

                document.assignedUsersList.forEach((u) => {
                    if (user.uid === u.id) {
                        assignedToMe = true;
                    }
                })
                return assignedToMe; // return only documents that have id === uid

            case 'development':
            case 'design':
            case 'marketing':
            case 'sales':
                return document.category === currentFilter; // return only doc categories == currentFilter

            default:
                return true; // return all
        }
    }) : null;

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>
            { error && <p className="error">{error}</p> }

            { documents && (
                <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />
            )}

            { projects && <ProjectList projects={projects} /> }
        </div>
    );
}

export default Dashboard;