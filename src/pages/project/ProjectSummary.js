// React
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// Components
import Avatar from "../../components/Avatar";

function ProjectSummary({ project }) {
    // Destructuring

    // destructure firestore
    const { deleteDocument } = useFirestore('projects');
    // destructure auth user
    const { user } = useAuthContext();
    // useNavigate
    const navigate = useNavigate();

    // Handlers

    // handle click
    const handleClick = (e) => {
        deleteDocument(project.id);
        navigate('/');
    }

    return (
        <div>
            <div className="project-summary">
                <h2 className="page-title">{project.name}</h2>
                <p>By {project.createdBy.displayName}</p>
                <p className="due-date">
                    Project due by {project.dueDate.toDate().toDateString()}
                </p>
                <p className="details">
                    {project.details}
                </p>
                <h4>Project is assigned to:</h4>
                <div className="assigned-users">
                    {project.assignedUsersList.map(user => (
                        <div key={user.id}>
                            <Avatar src={user.photoURL} />
                        </div>
                    ))}
                </div>
            </div>
            {user.uid === project.createdBy.id && (
                <button className="btn" onClick={handleClick}>Mark as Complete</button>
            )}
        </div>
    );
}

export default ProjectSummary;