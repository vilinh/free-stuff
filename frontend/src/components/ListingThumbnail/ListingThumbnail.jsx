import "./ListingThumbnail.css";
import { useEffect, useState } from "react";
import Image from "../../imageService";
import { Skeleton } from "@mui/material";

export const ListingThumbnail = ({ listing }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    const getImage = async () => {
			const res = await Image.getImageFromId(listing.image);
			if (res) {
				setImage(res.data.base64);
			}
		};

		getImage();
  })

  return (
    <div className="listing-thumbnail">
      {image ? 
        <img
          className="listing-thumbnail-img"
          src={image}
          alt="listing post"
          style={{
            width: 150,
            height: 150
          }}
        />
      : 
        <Skeleton variant="rectangular" width={150} height={150} />
      }
      <span>{listing.title}</span>
    </div>
  );
};
