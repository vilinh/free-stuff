import { useEffect, useState } from "react";
import Spinner from "@cloudscape-design/components/spinner";
import "./ListingPanel.css";
import { useAuth } from "../../context/Auth/AuthContext";
import {
  updateListingById,
  getListingsByCoordinates,
} from "../../utils/listingService";
import { getUserById, updateUserById } from "../../utils/userService";
import { getImageFromId } from "../../utils/imageService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export const ListingPanel = ({ listing }) => {
  const hasAddress = listing.hasOwnProperty("location");
  const hasDistance = listing.hasOwnProperty("distance");
  const [claimListing, setClaimListing] = useState(true);
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [user, setUser] = useState();
  const [distance, setDistance] = useState();
  const [datePosted, setDatePosted] = useState();
  const [condition, setCondition] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const getImage = async () => {
      const res = await getImageFromId(listing.image);
      if (res) {
        setImage(res.data.base64);
      } else {
        setImage(listing.image);
      }
    };
    const getListingAuthor = async () => {
      const res = await getUserById(listing.user_id);
      if (res) {
        setAuthor(res.data.email);
      }
    };

    const getCurrentUser = async () => {
      const res = await getUserById(currentUser.uid);
      if (res) {
        setUser(res.data);
        await getDistance(res);
      }
    };

    const getDistance = async (userInfo) => {
      const lat = userInfo.data.location.latitude;
      const lng = userInfo.data.location.longitude;
      const res = await getListingsByCoordinates(lat, lng);
      for (const l of res.data) {
        if (l._id === listing._id) {
          setDistance(l.distance);
          break;
        }
      }
    };

    const getDate = () => {
      const date = Date.parse(listing.details.posted_date);
      console.log(date);
      setDatePosted(
        new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      );
    };

    const getCondition = () => {
      let cond = "";
      switch (listing.details.condition) {
        case 0:
          cond = "Great";
          break;
        case 1:
          cond = "Good";
          break;
        case 2:
          cond = "Okay";
          break;
        case 3:
          cond = "Poor";
          break;
      }
      setCondition(cond);
    };

    const userInQueue = listing.claim_queue.indexOf(currentUser.uid) !== -1;
    setClaimListing(userInQueue);
    getListingAuthor();
    getImage();
    getCurrentUser();
    getDate();
    getCondition();
  }, []);

  const addUserToClaimQueue = async () => {
    setClaimListing(true);

    if (listing.claim_queue.indexOf(currentUser.uid) === -1) {
      listing.claim_queue.push(currentUser.uid);
      listing.claimed = true;
      await updateListingById(listing._id, listing);
    }

    if (user.claimed_listings.indexOf(listing._id) === -1) {
      console.log("here")
      user.claimed_listings.push(listing._id);
      await updateUserById(user.uid, user);
    }
  };

  const removeUserFromClaimQueue = async () => {
    setClaimListing(false);

    const userIdx = listing.claim_queue.indexOf(currentUser.uid);
    const listingIdx = user.claimed_listings.indexOf(listing._id);
    if (userIdx !== -1) {
      listing.claim_queue.splice(userIdx, 1);

      if (listing.claim_queue.length === 0) {
        listing.claimed = false;
      }
      await updateListingById(listing._id, listing);
    }

    if (listingIdx !== -1) {
      user.claimed_listings.splice(listingIdx, 1);
      await updateUserById(user._id, user);
    }
  };

  return (
    <div className="listing-wrapper">
      <div className="listing-panel">
        <div className="listing-r">
          {image ? <img className="listing-img" src={image} width={200} height={200}/> : <Spinner />}
        </div>
        <div className="listing-l">
          <h2 className="listing-title">{listing.title}</h2>
          <div className="listing-date">
            {datePosted ? <span>Listed on {datePosted}</span> : <span></span>}
          </div>
          <span
            className="listing-profile-link"
            onClick={() => navigate(`/user/${listing.user_id}`)}
          >
            {author && `${author}`}
          </span>
          <h3 className="listing-address">
            {hasAddress ? listing.location.address : "No Address"}
          </h3>
          <div className="listing-proximity">
            {distance ? (
              <span>{distance.toFixed(2)} miles away</span>
            ) : (
              <span></span>
            )}
          </div>
          <div className="listing-details">
            <h4>Details</h4>
            <div className="details">
              <div className="details-l">
                <span>Quantity</span>
                <span>Condition</span>
                <span>Categories</span>
              </div>
              <div className="details-r">
                <span>{listing.details.quantity}</span>
                <span>{condition}</span>
                <span>{listing.details.categories.join(", ")}</span>
              </div>
            </div>
          </div>
          <div className="listing-description">
            <h4>Description</h4>
            <p className="description-text">{listing.description}</p>
          </div>
          <div></div>
          <div className="claim">
            {currentUser.uid !== listing.user_id && (
              <div>
                {claimListing ? (
                  <button id="unclaim-btn" onClick={removeUserFromClaimQueue}>
                    Unclaim
                  </button>
                ) : (
                  <button id="claim-btn" onClick={addUserToClaimQueue}>
                    Claim
                  </button>
                )}
              </div>
            )}
            <p>
              {listing.claim_queue.length}
              {listing.claim_queue.length === 1 ? " user has " : " users have "}
              claimed this listing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
