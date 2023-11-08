import "./ListingThumbnail.css";
import { useEffect, useState } from "react";
import { getImageFromId } from "../../utils/imageService";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ListingThumbnail = ({ listing, editListing }) => {
	const [image, setImage] = useState("");
  const navigate = useNavigate();

	useEffect(() => {
		const getImage = async () => {
			const res = await getImageFromId(listing.image);
			if (res) {
				setImage(res.data.base64);
			}
		};

		getImage();
	});

	return (
		<div className="listing-thumbnail">
			{image ? (
				<img
					className="listing-thumbnail-img"
					src={image}
					alt="listing post"
					style={{
						width: 150,
						height: 150,
					}}
				/>
			) : (
				<Skeleton variant="rectangular" width={150} height={150} />
			)}
			<span>{listing.title}</span>
			{editListing && <button onClick={() => navigate(`/editListing/${listing._id}`)}>Edit Listing</button>}
		</div>
	);
};
