import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import Autocomplete from "react-google-autocomplete";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";

const SignUp = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [err, setErr] = useState(false);
  const [location, setLocation] = useState();
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/user");
    }
  }, []);

  useEffect(() => {
    if (email !== "" && password !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const signUp = (e) => {
    setErr(false);
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        makePostCall(cred.user, location);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setErr(true);
        switch (error.code) {
          case "auth/weak-password":
            setErrMsg(
              "Weak password: Password should be at least 6 characters."
            );
            break;
          case "auth/email-already-in-use":
            setErrMsg("Account already exists with this email.");
            break;
          default:
            setErrMsg("Error");
        }
      });
  };

  const handlePlaceSelected = (place) => {
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const address = place.formatted_address;
    const loc = {
      address,
      latitude,
      longitude,
    };
    setLocation(loc);
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={signUp}>
        <div className="form-div">
          <h2>Create An Account</h2>
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
          <Autocomplete
            style={{
              border: ".05rem solid",
              borderRadius: ".5rem",
              width: "93%",
              fontSize: ".85rem",
              padding: ".9rem .8rem",
            }}
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={handlePlaceSelected}
            onChange={() => {
              setLocation();
            }}
          />
          <button disabled={disabled} type="submit">
            Sign Up
          </button>
        </div>
      </form>

      <Link className="login-link" to="/login">
        <span>Already have an account? Login.</span>
      </Link>
      <span className="err-msg">{err && errMsg}</span>
    </div>
  );
};

async function makePostCall(user, location) {
  try {
    const newUser = {
      uid: user.uid,
      email: user.email,
      location: location ? location : undefined,
    };
    await axios.post("http://localhost:8000/user", newUser);
  } catch (error) {
    console.log(error);
  }
}

export default SignUp;
