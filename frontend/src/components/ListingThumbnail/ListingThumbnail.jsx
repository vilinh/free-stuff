import "./ListingThumbnail.css";
import { useEffect, useState } from "react";
import { getImageFromId } from "../../utils/imageService";
import { Box, Button, Modal, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteListingById } from "../../utils/listingService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { NotifMsg, NotifType, useNotif } from "../../context/Notifications/NotificationContext";
import { DeleteModal } from "../DeleteModal/DeleteModal";


export const ListingThumbnail = ({
  listing,
  editListing,
  refresh,
  setRefresh,
}) => {
  const [image, setImage] = useState("");
  const [hover, setHover] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { createNotif } = useNotif()

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
	await deleteListingById(listing._id);
	createNotif(NotifMsg.DELETE_LISTING_SUCCESS, NotifType.SUCCESS)
	navigate("/user");
};

  return (
    <div className="listing-thumbnail">
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="listing"
      >
        {image ? (
          <img
            className="listing-thumbnail-img"
            src={image}
            alt="listing post"
            style={{
              width: "8rem",
              height: "8rem",
              objectFit: "cover",
            }}
          />
        ) : (
          <Skeleton variant="rectangular" width={150} height={150} />
        )}
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
				borderRadius: ".25rem"
              }}
              onClick={() => 
				{
					navigate(`/editListing/${listing._id}`)
			}}
            />
          </>
        )}
      </div>
      {editListing && <div className="thumbnail-icons"></div>}
    </div>
  );
};
