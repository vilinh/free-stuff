import "./ListingThumbnail.css";
import { useEffect, useState } from "react";
import Image from "../../imageService";

export const ListingThumbnail = ({ listing }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    const getImage = async () => {
			const res = await Image.getImageFromId(listing.image);
      console.log(res)
			if (res) {
				setImage(res.data.base64);
			}
		};

		getImage();
  })

  return (
    <div className="listing-thumbnail">
      <img
        className="listing-thumbnail-img"
        src={image}
        alt="listing post"
      />
      <span>{listing.title}</span>
    </div>
  );
};
