import { Avatar } from "@mui/material";
import Button from "@cloudscape-design/components/button";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Input from "@cloudscape-design/components/input";
import { useEffect, useState } from "react";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import Autocomplete from "react-google-autocomplete";
import { LocationSVG } from "../../svgs/LocationSVG";
import { useLocationContext } from "../../context/Location/LocationContext";
import Icon from "@cloudscape-design/components/icon";

export const NavBar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [locationPref, setLocationPref] = useState(false);
  const [searchLoc, setSearchLoc] = useState("");

  const { findLocation, setAddress, loading, address } = useLocationContext();

  useEffect(() => {
    // set search bar value from url
    const pathArray = window.location.pathname.split("/")
    const idx = pathArray.indexOf('search')

    if (idx !== -1 && idx !== pathArray.length - 1) {
      setSearch(pathArray[idx + 1])
    }

  }, [])

  const handlePlaceSelected = (place) => {
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const address = place.formatted_address;
    const loc = {
      address,
      latitude,
      longitude,
    };
    setSearchLoc(address);
  };

  const confirmPlaceSelected = () => {
    setAddress(searchLoc);
    setLocationPref(false);
    setSearchLoc("");
  };

  const handleFindLocation = () => {
    findLocation();
    setSearchLoc("");
  };

  return (
    <>
      <Modal
        onDismiss={() => setLocationPref(false)}
        visible={locationPref}
        header="Pick a location"
      >
        <SpaceBetween direction="vertical">
          <div className="modal-contents">
            Manually enter location or click the Find My Location button to do
            it automatically.
            <div className="manual-input">
              <Autocomplete
                style={{
                  border: ".05rem solid",
                  borderRadius: ".25rem",
                  width: "80%",
                  fontSize: "1rem",
                  padding: ".5rem",
                }}
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                onPlaceSelected={handlePlaceSelected}
                options={{
                  types: ["address"],
                }}
                onChange={() => {
                  setSearchLoc("");
                }}
              />
              <Button
                onClick={() => confirmPlaceSelected()}
                disabled={searchLoc === ""}
                variant="primary"
              >
                Ok
              </Button>
            </div>
            <div className="autolocate-div">
              <Button onClick={() => handleFindLocation()}>
                Find My Location
              </Button>
              <span style={{ marginLeft: "1rem" }}>
                {loading ? (
                  <Spinner />
                ) : (
                  address && (
                    <div className="autolocate-result">
                      {address}
                      <div id="check-icon" onClick={() => setLocationPref(false)}>
                        <Icon name="check" variant="success" />
                      </div>
                    </div>
                  )
                )}
              </span>
            </div>
          </div>
        </SpaceBetween>
      </Modal>
      <div className="navbar">
        <div className="navbar-l">
          <Link className="link" to="/">
            <h3 className="logo-text">Broke Blessings</h3>
          </Link>
          <span className="location-pref" onClick={() => setLocationPref(true)}>
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
