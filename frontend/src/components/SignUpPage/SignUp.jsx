import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./SignUp.css";
import { Box, Button } from "@mui/material";
import Autocomplete from "react-google-autocomplete";

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
			<h1 className="signup-title">Create an Account</h1>
			<Box
				onSubmit={signUp}
				component="form"
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
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
				<Autocomplete
					style={{
						border: ".05rem solid",
						borderRadius: ".25rem",
						width: "91%",
						fontSize: "1rem",
						padding: ".5rem",
					}}
					apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
					onPlaceSelected={handlePlaceSelected}
					onChange={() => {
						setLocation()
					}}
				/>
				<Button disabled={disabled} type="submit" variant="outlined">
					Sign Up
				</Button>
			</Box>
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
      location: location ? location : undefined
		};
		await axios.post("http://localhost:8000/user", newUser);
	} catch (error) {
		console.log(error);
	}
}

export default SignUp;
