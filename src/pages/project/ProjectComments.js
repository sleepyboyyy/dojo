// React
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { timestamp } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";

// JS library
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// components
import Avatar from "../../components/Avatar";



function ProjectComments({ project }) {
    // Destructuring

    // destructure firestore
    const { updateDocument, response } = useFirestore('projects');
    // destructure auth user
    const { user } = useAuthContext();

    // Comment state
    const [newComment, setNewComment] = useState('');

    // Handlers

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const commentToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: newComment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random()
        }

        await updateDocument(
            project.id,
            {
                comments: [ ...project.comments, commentToAdd ]
            }
        )

        if (!response.error) {
            setNewComment('');
        }
    }

    // Make sure comment scroll is on bottom
    setTimeout(() => {
        let objDiv = document.querySelector('#scr');
        objDiv.scrollTop = objDiv.scrollHeight;
    }, 0)

    return (
        <div onSubmit={handleSubmit} className="project-comments">
            <h4>Project Comments</h4>
            <ul className="wrapper" id="scr">
                {project.comments.length > 0 && project.comments.map(comment => (
                    <li key={comment.id}>
                        <div className="comment-author">
                            <Avatar src={comment.photoURL} />
                            <p>{comment.displayName}</p>
                        </div>
                        <div className="comment-date">
                            <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                        </div>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <form className="add-comment">
                <label>
                    <span>Add new comment:</span>
                    <textarea
                        required
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                    ></textarea>
                </label>
                <button className="btn">Add Comment</button>
            </form>
        </div>
    );
}

export default ProjectComments;