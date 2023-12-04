import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  convertBase64,
  postImage,
  getImageFromId,
  updateImageById,
} from "../../utils/imageService";
import { getUserById, updateUserById } from "../../utils/userService";
import "../CreateListing/CreateListing.css";
import { Button, CircularProgress, TextField } from "@mui/material";
import InputFileUpload from "../InputFileUpload/InputFileUpload";
import { isEqual } from "lodash";
import {
  NotifMsg,
  NotifType,
  useNotif,
} from "../../context/Notifications/NotificationContext";

export const EditUser = ({ listing }) => {
  const { currentUser } = useAuth();
  const { createNotif } = useNotif();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [imageId, setImageId] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageUpdated, setImageUpdated] = useState(false);
  const [hasProfilePic, setHasProfilePic] = useState(true);
  const [base64, setBase64] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [biography, setBiography] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [origUser, setOrigUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getUserById(currentUser.uid);
        const user = data.data;
        const { display_name, profile_pic, display_location, biography } = user;

        let imageRes = await getImageFromId(profile_pic);
        if (!imageRes) {
          imageRes = { data: { base64: "", name: "" } };
          setHasProfilePic(false);
        }
        const { base64, name } = imageRes.data;

        delete user["_id"];
        delete user["__v"];
        setOrigUser(user);

        setDisplayName(display_name);
        setDisplayLocation(display_location);
        setBiography(biography);
        setImageId(profile_pic);
        setBase64(base64);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // navigate("/");
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const user = {
      display_name: displayName,
      display_location: displayLocation,
      biography: biography,
      profile_pic: imageId ?? "",
    };

    const orig = {
      display_name: origUser.display_name,
      display_location: origUser.display_location,
      biography: origUser.biography,
      profile_pic: origUser.profile_pic ?? "",
    };

    if (isEqual(user, orig) && !imageUpdated) {
      setCanSubmit(false);
    } else {
      setUpdatedUser(user);
      setCanSubmit(true);
    }
  }, [displayName, displayLocation, biography, imageId, imageUpdated]);

  const submitUser = async () => {
    setCanSubmit(false);
    let id = "";
    if (hasProfilePic) {
      await updateImageById(imageId, {
        base64: base64,
        name: imageName,
      });
      id = imageId;
    } else {
      const imgRes = await postImage({
        base64: base64,
        name: imageName,
      });
      id = imgRes.data._id;
      setImageId(id);
    }
    const user = {
      display_name: displayName,
      display_location: displayLocation,
      biography: biography,
      profile_pic: id,
    };

    console.log(user);
    const res = await updateUserById(currentUser.uid, user);
    if (res) {
      createNotif(NotifMsg.EDIT_PROFILE_SUCCESS, NotifType.SUCCESS);
    } else {
      createNotif(NotifMsg.EDIT_PROFILE_ERROR, NotifType.ERROR);
    }
    navigate("/user");
  };

  const handleImageUpload = async (e) => {
    setImageUpdated(true);
    const file = e.target.files[0];
    if (file && file.size > 1000000) {
      setBase64("");
      setImageName("Error: file size limit exceeded");
    } else if (file) {
      const base64 = await convertBase64(file);
      setBase64(base64);
      setImageName(file.name);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className="create-listing-div">
      <h1>Edit User</h1>
      <InputFileUpload handleImageUpload={handleImageUpload}></InputFileUpload>
      {base64 && <img src={base64} width={200} height={200} />}
      {imageName && <p>{imageName}</p>}

      <TextField
        label="Display Name"
        id="filled-basic"
        variant="filled"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <TextField
        label="Display Location"
        id="filled-basic"
        variant="filled"
        value={displayLocation}
        onChange={(e) => setDisplayLocation(e.target.value)}
      />
      <TextField
        label="Biography"
        id="filled-textarea"
        multiline
        variant="filled"
        value={biography}
        onChange={(e) => setBiography(e.target.value)}
        rows={4}
      />
      <Button variant="contained" onClick={submitUser} disabled={!canSubmit}>
        Submit
      </Button>
    </div>
  );
};
