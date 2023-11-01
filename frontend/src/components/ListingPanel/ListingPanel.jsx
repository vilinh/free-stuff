import { UserPanel } from "../UserPanel/UserPanel";
import "./ListingPanel.css";

export const ListingPanel = ({ listing }) => {
  const hasAddress = listing.hasOwnProperty('location');

  return (
    <div className="listing-wrapper">
      <div className="listing">
        <div className="listing-r">
          <img className="listing-img" src={listing.image} />
        </div>
        <div className="listing-l">
          <span className="listing-date">Posted X Days Ago</span>
          <h2 className="listing-title">{listing.title}</h2>
          <h3 className="listing-address">{hasAddress ? listing.location.address : "No Address"}</h3>
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
          <div>

          </div>
          <button className="claim-btn" disabled={listing.claimed}>
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};
