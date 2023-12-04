import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import "./ListingPanel.css";
import { useAuth } from "../../context/Auth/AuthContext";
import { updateListingById } from "../../utils/listingService";
import { getUserById, updateUserById } from "../../utils/userService";

export const ListingPanel = ({ listing }) => {
  const hasAddress = listing.hasOwnProperty("location");
  const hasDistance = listing.hasOwnProperty("distance");
  const [claimListing, setClaimListing] = useState(true);
  const [author, setAuthor] = useState("");
  const [user, setUser] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
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
      }
    };

    const userInQueue = listing.claim_queue.indexOf(currentUser.uid) !== -1;
    setClaimListing(userInQueue);
    getListingAuthor();
    getCurrentUser();
  }, []);

  const addUserToClaimQueue = async () => {
    setClaimListing(true);

    if (listing.claim_queue.indexOf(currentUser.uid) === -1) {
      listing.claim_queue.push(currentUser.uid);
      listing.claimed = true;
      await updateListingById(listing._id, listing);
    }

    if (user.claimed_listings.indexOf(listing._id) === -1) {
      user.claimed_listings.push(listing._id);
      await updateUserById(user._id, user);
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
          {listing.image ? <img className="listing-img" src={listing.image} /> : <Skeleton variant="rectangular" width={300} height={300} />}
        </div>
        <div className="listing-l">
          <span className="listing-date">
            Posted {author && `by ${author}`}
          </span>
          <h2 className="listing-title">{listing.title}</h2>
          <h3 className="listing-address">
            {hasAddress ? listing.location.address : "No Address"}
          </h3>
          <div className="listing-proximity">
            {hasDistance ? (
              <span>{listing.distance.toFixed(2)} miles away</span>
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
                <span>{listing.details.condition}</span>
                <span>{listing.details.categories}</span>
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
