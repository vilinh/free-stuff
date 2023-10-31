import { Avatar, Button } from "@mui/material";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
export const NavBar = () => {
  const { currentUser } = useAuth();

  return (
		<div className="navbar">
			<div className="navbar-l">
				<Link className="link" to="/">
					<h3 className="logo-text">Broke Blessings</h3>
				</Link>
				<Link className="link" to="/listing">
					<p className="view-listings-link">View Listings</p>
				</Link>
			</div>
			<div className="navbar-r">
				{currentUser ? (
					<>
						<Button onClick={() => signOut(auth)} variant="text" size="small">
							Sign Out
						</Button>
						<Link className="link" to="/user">
							<Avatar
								alt="profile pic"
								src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
							/>
						</Link>
					</>
				) : (
					<>
						<Link to="/signup">
							<Button variant="text" size="small">
								Sign Up
							</Button>
						</Link>
						<Link to="/login">
							<Button variant="text" size="small">
								Log in
							</Button>
						</Link>
					</>
				)}
				<Link to="/createListing">
					<Button variant="contained" size="small">
						List an item
					</Button>
				</Link>
			</div>
		</div>
	);
};
