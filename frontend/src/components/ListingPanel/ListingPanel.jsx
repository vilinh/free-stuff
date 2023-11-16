import { useEffect, useState } from "react";
import { UserPanel } from "../UserPanel/UserPanel";
import { getImageFromId } from "../../utils/imageService";
import "./ListingPanel.css";
import { useAuth } from "../../context/Auth/AuthContext";
import { updateListingById } from "../../utils/listingService";

export const ListingPanel = ({ listing }) => {
  const hasAddress = listing.hasOwnProperty("location");
  const hasDistance = listing.hasOwnProperty("distance");
  const [image, setImage] = useState("");
  const { currentUser } = useAuth();

  console.log(listing.claim_queue);

  useEffect(() => {
    const getImage = async () => {
      const res = await getImageFromId(listing.image);
      if (res) {
        setImage(res.data.base64);
      }
    };

    getImage();
  }, []);

  const addUserToClaimQueue = async () => {
    listing.claim_queue.push(currentUser.uid);
    listing.claimed = true;
    await updateListingById(listing._id, listing);
  };

  return (
    <div className="listing-wrapper">
      <div className="listing">
        <div className="listing-r">
          <img className="listing-img" src={image} />
        </div>
        <div className="listing-l">
          <span className="listing-date">Posted X Days Ago</span>
          <h2 className="listing-title">{listing.title}</h2>
          <h3 className="listing-address">
            {hasAddress ? listing.location.address : "No Address"}
          </h3>
          <div className="listing-proximity">
            {hasDistance ? (
              <span>{listing.distance} miles away</span>
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
          <button
            className="claim-btn"
            disabled={listing.claimed}
            onClick={addUserToClaimQueue}
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};
