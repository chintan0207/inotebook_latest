import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    let navigate = useNavigate();
    const [errors, setErrors] = useState({});
    console.log(errors);

    const validation = (formdata) => {
        let errors = {}
        if (!formdata.email) {
            errors.email = "*Email is required";
        }
        if (!formdata.password) {
            errors.password = "*Password is required";
        }

        return errors
    }
    const validationError = validation(credentials);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(validationError).length === 0) {
            try {
                const response = await fetch(
                    "https://inotebook-latest.onrender.com/api/auth/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    }
                );
                const json = await response.json();
                console.log(json);

                if (json.success) {
                    // Save the auth token and redirect
                    localStorage.setItem("token", json.authtoken);
                    setErrors({});
                    navigate("/");
                    setCredentials({ email: "", password: "" });
                    props.showAlert("Logged in successfully", "success");
                } else {
                    setErrors({});
                    props.showAlert("Invalid Credentials", "danger");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setErrors(validationError);
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <h2>Login to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="my-4 position-relative">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={credentials.email}
                        name="email"
                        onChange={onChange}
                        aria-describedby="emailHelp"
                    />
                    {errors.email && (
                        <span className="error-text position-absolute text-danger">
                            {errors.email}
                        </span>
                    )}
                </div>
                <div className="mb-4 position-relative">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={credentials.password}
                        name="password"
                        onChange={onChange}
                    />
                    {errors.password && (
                        <span className="error-text position-absolute text-danger">
                            {errors.password}
                        </span>
                    )}
                </div>

                <button type="submit" className="btn btn-primary my-3 ">
                    Login
                </button>
                <button
                    type="submit"
                    onClick={() => {
                        navigate("/signup");
                    }}
                    className="btn btn-primary mx-2 my-3"
                >
                    Signup
                </button>
            </form>
        </div>
    );
};

export default Login;
