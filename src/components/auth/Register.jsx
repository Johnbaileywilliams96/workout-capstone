import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { createUser, getUserByEmail } from "../services/userService";
// import { createUser, getUserByEmail } from "../../services/userService";

export const Register = (props) => {
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    const [user, setUser] = useState({
        email: "",
        date: formatDate(new Date())
    });
    let navigate = useNavigate();

    const registerNewUser = () => {
        const newUser = {
            ...user,
            // address: parseInt(user.address),
        };

        createUser(newUser).then((createdUser) => {
            if (createdUser.hasOwnProperty("id")) {
                localStorage.setItem(
                    "employee_user",
                    JSON.stringify({
                        id: createdUser.id
                    })
                );

                navigate("/");
            }
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        getUserByEmail(user.email).then((response) => {
            if (response.length > 0) {
                // Duplicate email. No good.
                window.alert("Account with that email address already exists");
            } else {
                // Good email, create user.
                registerNewUser();
            }
        });
    };

    const updateUser = (evt) => {
        const copy = { ...user };
        copy[evt.target.id] = evt.target.value;
        setUser(copy);
    };

    return (
        <main className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h1 className="header">Learning Moments</h1>
                <h2>Please Register</h2>
                <fieldset className="auth-fieldset">
                    <div>
                        <input
                            onChange={updateUser}
                            type="text"
                            id="name"
                            className="auth-form-input"
                            placeholder="Enter your name"
                            required
                            autoFocus
                        />
                    </div>
                </fieldset>
                <fieldset className="auth-fieldset">
                    <div>
                        <input
                            onChange={updateUser}
                            type="email"
                            id="email"
                            className="auth-form-input"
                            placeholder="Email address"
                            required
                        />
                    </div>
                </fieldset>
                {/* <fieldset className="auth-fieldset">
                    <div>
                        <input
                            onChange={updateUser}
                            type="number"
                            id="cohort"
                            className="auth-form-input"
                            placeholder="Cohort #"
                            required
                        />
                    </div>
                </fieldset> */}
                <fieldset className="auth-fieldset">
                    <div>
                        <button type="submit">Register</button>
                    </div>
                </fieldset>
            </form>
        </main>
    );
};
