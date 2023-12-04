import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext";
import { useEffect, useState } from "react";
import { getImageFromId } from "../../utils/imageService";
import { getUserById } from "../../utils/userService";

export default function ProfileMenu() {
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userProf, setUserProf] = useState({});
  const [image, setImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
  );
  const open = Boolean(anchorEl);

  useEffect(() => {
    const getImage = async () => {
      if (Object.hasOwn(userProf, "profile_pic") && userProf.profile_pic) {
        const res = await getImageFromId(userProf.profile_pic);
        if (res) {
          setImage(res.data.base64);
        }
      }
    };
    const getUser = async () => {
      let response = await getUserById(currentUser.uid);
      setUserProf(response["data"]);
    };
    getUser();
    getImage();
  }, [userProf]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar alt="profile pic" src={image} />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/user");
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/claimedListings");
          }}
        >
          Claimed Listings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/myListingsDetails");
          }}
        >
          My Listings Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/editUser");
          }}
        >
          Edit Profile
        </MenuItem>
      </Menu>
    </div>
  );
}
