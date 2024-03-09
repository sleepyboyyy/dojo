
// styles
import './Avatar.css'

function Avatar({ src }) {
    return (
        <div className="avatar">
            <img src={src} alt="avatar img"/>
        </div>
    );
}

export default Avatar;