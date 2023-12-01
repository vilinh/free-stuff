import "./ListingThumbnail.css";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteListingById } from "../../utils/listingService";
import EditIcon from "@mui/icons-material/Edit";
import {
	NotifMsg,
	NotifType,
	useNotif,
} from "../../context/Notifications/NotificationContext";

export const ListingThumbnail = ({ listing, editListing }) => {
	const [hover, setHover] = useState(false);
	const navigate = useNavigate();
	const { createNotif } = useNotif();

	const deleteListing = async () => {
		await deleteListingById(listing._id);
		createNotif(NotifMsg.DELETE_LISTING_SUCCESS, NotifType.SUCCESS);
		navigate("/user");
	};

	const goToDetailedPage = () => {
		navigate(`/listing/${listing._id}`);
	};

	return (
		<div className="listing-thumbnail">
			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				className="listing"
			>
				<div className="image" onClick={goToDetailedPage}>
					{listing.image ? (
						<>
							<img
								className="listing-thumbnail-img"
								src={listing.image}
								alt="listing post"
								style={{
									width: "8rem",
									height: "8rem",
									objectFit: "cover",
								}}
							/>
							<span className="listing-title">{listing.title}</span>
						</>
					) : (
						<Skeleton variant="rectangular" width={150} height={150} />
					)}
				</div>
				{listing.claimed && <span className="claimed-tag">Claimed</span>}
				{editListing && hover && (
					<>
						<EditIcon
							style={{
								fontSize: "1rem",
								position: "absolute",
								top: ".25rem",
								right: ".25rem",
								color: "white",
								backgroundColor: "rgba(0, 0, 0, 0.8)",
								padding: ".25rem",
								borderRadius: ".25rem",
							}}
							onClick={() => {
								navigate(`/editListing/${listing._id}`);
							}}
						/>
					</>
				)}
			</div>
			{editListing && <div className="thumbnail-icons"></div>}
		</div>
	);
};
