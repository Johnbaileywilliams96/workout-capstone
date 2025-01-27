import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";



export const NavBar = () => {
    const navigate = useNavigate();
    return (
        <ul>
            <li>
                <Link to="/workoutLog" className="navbar-link">Workout Log</Link>
            </li>

            {localStorage.getItem("users_user") ? (
                <li>
                    <Link
                        className="navbar-link"
                        to=""
                        onClick={() => {
                            localStorage.removeItem("users_user");
                            navigate("/login", { replace: true });
                        }}
                    >
                        Logout
                    </Link>
                </li>
            ) : (
                ""
            )}
        </ul>
    );
};
