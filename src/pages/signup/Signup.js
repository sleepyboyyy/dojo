// styles
import './Signup.css'

// React
import {useState} from "react";
import {useSignup} from "../../hooks/useSignup";

function Signup() {
    // Form states without file selection
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    // Form states only file selection
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailError, setThumbnailError] = useState(null);

    // useSignup destructuring
    const { signup, error, isPending } = useSignup();

    // Handlers
    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        signup(email, password, displayName, thumbnail);
    }

    // File handler
    const handleFileChange = (e) => {
        setThumbnail(null);

        let selected = e.target.files[0];
        console.log(selected);

        // FILE ERROR HANDLING

        // null selected handle
        if (!selected) {
            setThumbnailError('Please select a file');
            return
        }

        // non-image selection handle
        if (!selected.type.includes('image')) {
            setThumbnailError('Selected file must be an image');
            return
        }

        // large image selection handle
        if (selected.size > 1000000) {
            setThumbnailError('Image file size must be less than 1Mb');
            return
        }

        setThumbnailError(null);
        setThumbnail(selected);
        //console.log('thumbnail updated');
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Sign up</h2>
            <label>
                <span>Display name:</span>
                <input
                    required
                    type="text"
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                />
            </label>
            <label>
                <span>Email:</span>
                <input
                    required
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
            <label>
                <span>Password:</span>
                <input
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            <label>
                <span>Profile thumbnail:</span>
                <input
                    required
                    type="file"
                    onChange={handleFileChange}
                />
                { thumbnailError && <div className="error">{thumbnailError}</div> }
            </label>
            { !isPending && <button className="btn">Sign up</button> }
            { isPending && <button className="btn" disabled >loading..</button> }
            { error && <div className="error">{error}</div> }
        </form>
    );
}

export default Signup;