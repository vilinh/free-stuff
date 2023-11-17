import { Avatar } from "@mui/material";
import Button from "@cloudscape-design/components/button";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Input from "@cloudscape-design/components/input";
import { useEffect, useState } from "react";
import { LocationSVG } from "../../svgs/LocationSVG";
import { LocationModal } from "../../modal/LocationModal";

export const NavBar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false)

  useEffect(() => {
    // set search bar value from url
    const pathArray = window.location.pathname.split("/")
    const idx = pathArray.indexOf('search')

    if (idx !== -1 && idx !== pathArray.length - 1) {
      setSearch(pathArray[idx + 1])
    }

  }, [])



  return (
    <>
      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      ></LocationModal>
      <div className="navbar">
        <div className="navbar-l">
          <Link className="link" to="/">
            <h3 className="logo-text">Broke Blessings</h3>
          </Link>
          <span className="location-pref" onClick={() => setShowLocationModal(true)}>
            <LocationSVG></LocationSVG>
          </span>
        </div>
        <div className="navbar-m">
          <form onSubmit={() => navigate(`/search/${search}`)}>
            <Input
              onChange={({ detail }) => setSearch(detail.value)}
              value={search}
              placeholder="Search"
            />
          </form>
        </div>
        <div className="navbar-r">
          {currentUser ? (
            <>
              <Button onClick={() => signOut(auth)} variant="inline-link">
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
                <Button variant="inline-link">Sign Up</Button>
              </Link>
              <Link to="/login">
                <Button variant="inline-link">Log in</Button>
              </Link>
            </>
          )}
          <Link to="/createListing">
            <Button variant="primary">List an item</Button>
          </Link>
        </div>
      </div>
    </>
  );
};
