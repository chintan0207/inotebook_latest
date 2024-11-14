import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validate from "./validate";
import noteContext from "../context/notes/noteContext";

const Signup = (props) => {
  const context = useContext(noteContext);
  const { host } = context
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  console.log(errors);
  const validationError = validate(credentials);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = credentials;

    if (Object.keys(validationError).length === 0) {
      try {
        const response = await fetch(
          `${host}/api/auth/createuser/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ name, email, password }),
          }
        );
        const json = await response.json();
        console.log(json);

        if (json.success) {
          // Save the auth token and redirect
          localStorage.setItem("token", json.authtoken);
          setErrors({});
          setCredentials({ name: "", email: "", password: "", cpassword: "" });
          navigate("/");
          props.showAlert("Account created successfully", "success");
        } else {
          props.showAlert("Invalid details", "danger");
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
      <h2>Create account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-4 position-relative">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
            aria-describedby="emailHelp"
          />
          {errors.name && (
            <span className="error-text position-absolute text-danger">
              {errors.name}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
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
        <div className="mb-4">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            minLength={5}

          />
          {errors.password && (
            <span className="error-text position-absolute text-danger">
              {errors.password}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            minLength={5}
          />
          {errors.cpassword && (
            <span className="error-text position-absolute text-danger">
              {errors.cpassword}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-primary mb-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
