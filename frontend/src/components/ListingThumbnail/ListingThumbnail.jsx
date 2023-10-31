import "./ListingThumbnail.css";

export const ListingThumbnail = ({ listing }) => {
  return (
    <div className="listing-thumbnail">
      <img
        className="listing-thumbnail-img"
        src={listing.image}
        alt="listing post"
      />
      <span>{listing.title}</span>
    </div>
  );
};
