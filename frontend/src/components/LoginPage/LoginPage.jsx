import React, { useState } from "react";
import "./LoginPage.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("signed in");
        navigate("/user");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={signIn}>
        <div className="form-div">
          <h2>Login</h2>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Enter a password (6+ chars)"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
        </div>
      </form>
      <Link to="/signup" className="signup-link">
        <span>Don't have an account? Register here</span>
      </Link>
    </div>
  );
};

export default LoginPage;
