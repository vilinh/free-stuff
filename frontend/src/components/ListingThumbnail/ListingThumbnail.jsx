import "./ListingThumbnail.css";
import { useEffect, useState } from "react";
import { getImageFromId } from "../../utils/imageService";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteListingById } from "../../utils/listingService";

export const ListingThumbnail = ({ listing, editListing, refresh, setRefresh }) => {
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

	const deleteListing = async () => {
		await deleteListingById(listing._id)
		setRefresh(!refresh)
	}

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
			{editListing && (
				<div>
					<button onClick={() => navigate(`/editListing/${listing._id}`)}>
						Edit Listing
					</button>
					<button onClick={deleteListing}>
						Delete Listing
					</button>
				</div>
			)}
		</div>
	);
};
