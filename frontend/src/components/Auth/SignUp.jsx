import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./SignUp.css";
import { Box, Button } from "@mui/material";

const SignUp = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/user");
    }
  }, []);

  const signUp = (e) => {
    setErr(false);
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        makePostCall(cred.user);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setErr(true);
        console.log(error.message);
        setErrMsg(error.message.slice(10));
      });
  };

  return (
    <div className="sign-up-container">
      <h1>Create an Account</h1>
      <Box
        onSubmit={signUp}
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="email"
          type="email"
          placeholder="Enter your email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          type="password"
          placeholder="Enter a password (6+ chars)"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="outlined">
          Sign Up
        </Button>
      </Box>
      <Link className="login-link" to="/login"><span>Already have an account? Login.</span></Link>
      <span className="err-msg">{err && errMsg}</span>
    </div>
  );
};

async function makePostCall(user) {
  try {
    const newUser = {
      uid: user.uid,
      email: user.email,
    };
    await axios.post("http://localhost:8000/user", newUser);
  } catch (error) {
    console.log(error);
  }
}

export default SignUp;
