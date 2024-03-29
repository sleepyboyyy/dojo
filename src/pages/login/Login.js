// styles
import './Login.css'

// React
import {useState} from "react";
import {useLogin} from "../../hooks/useLogin";

function Login() {
    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Login destructuring
    const { login, error, isPending } = useLogin();

    // handlers
    // submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>
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
            { !isPending && <button className="btn">Login</button> }
            { isPending && <button className="btn" disabled>loading..</button> }
            { error && <div className="error">{error}</div> }
        </form>
    );
}

export default Login;