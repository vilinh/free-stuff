import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  convertBase64,
  postImage,
  getImageFromId,
  updateImageById,
} from "../../utils/imageService";
import {
  categoryOptions,
  conditionOptions,
  deleteListingById,
  getListingById,
  updateListingById,
} from "../../utils/listingService";
import Autocomplete from "react-google-autocomplete";
import CustomAutocomplete from "@mui/material/Autocomplete";
import "../CreateListing/CreateListing.css";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import InputFileUpload from "../InputFileUpload/InputFileUpload";
import { useParams } from "react-router-dom";
import { isEqual } from "lodash";
import {
  NotifMsg,
  NotifType,
  useNotif,
} from "../../context/Notifications/NotificationContext";
import { DeleteModal } from "../DeleteModal/DeleteModal";

export const EditListing = ({ listing }) => {
  const { currentUser } = useAuth();
  const { createNotif } = useNotif();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState("");
  const [imageId, setImageId] = useState("");
  const [base64, setBase64] = useState("");
  const [imageName, setImageName] = useState("");
  const [location, setLocation] = useState({});
  const [postedDate, setPostedDate] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ogListing, setOgListing] = useState({});
  const [updatedListing, setUpdatedListing] = useState({});

  const [deleteModal, setDeleteModal] = useState(false);

  // load initial data
  useEffect(() => {
    const getListingData = async () => {
      try {
        const data = await getListingById(id);
        const listing = data.data;
        const { title, description, details, image, location } = listing;
        const { categories, condition, quantity, posted_date } = details;

        const imageRes = await getImageFromId(image);
        const { base64, name } = imageRes.data;

        delete listing["_id"];
        delete listing["claim_queue"];
        delete listing["__v"];
        setOgListing(listing);

        setTitle(title);
        setDescription(description);
        setCondition(condition);
        setQuantity(quantity);
        setCategories(categories);
        setLocation(location);
        setPostedDate(posted_date);
        setImageId(image);
        setBase64(base64);
        setImageName(name);

        setIsLoading(false);
      } catch (error) {
        // TODO: Error Page
        navigate("/");
      }
    };

    getListingData();
  }, []);

  useEffect(() => {
    // check if listing has been changed
    const details = {
      quantity: quantity,
      condition: condition,
      posted_date: postedDate,
      categories: categories,
    };
    const listing = {
      title: title,
      location: location,
      description: description,
      user_id: currentUser.uid,
      claimed: false,
      details: details,
      image: imageId,
    };
    console.log(listing);

    if (isEqual(listing, ogListing)) {
      setCanSubmit(false);
    } else if (
      !title ||
      !description ||
      categories.length === 0 ||
      condition === undefined ||
      !base64 ||
      Object.keys(location).length === 0
    ) {
      setCanSubmit(false);
    } else {
      setUpdatedListing(listing);
      setCanSubmit(true);
    }
  }, [title, description, categories, quantity, condition, base64, location]);

  const submitListing = async () => {
    setCanSubmit(false);

    await updateImageById(imageId, {
      base64: base64,
      name: imageName,
    });
    const res = await updateListingById(id, updatedListing);
    if (res) {
      createNotif(NotifMsg.EDIT_LISTING_SUCCESS, NotifType.SUCCESS);
    } else {
      createNotif(NotifMsg.EDIT_LISTING_ERROR, NotifType.ERROR);
    }

    navigate("/user");
  };

  const handleConditionSelected = (event) => {
    setCondition(event.target.value);
  };

  const handlePlaceSelected = (place) => {
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const address = place.formatted_address;
    const loc = {
      address,
      latlng: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };
    setLocation(loc);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (isNaN(value)) {
      return;
    }
    setQuantity(value);
  };

  const handleImageUpload = async (e) => {
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

  const deleteListing = async () => {
    const res = await deleteListingById(id);
    if (res) {
      createNotif(NotifMsg.DELETE_LISTING_SUCCESS, NotifType.SUCCESS);
    } else {
      createNotif(NotifMsg.DELETE_LISTING_ERROR, NotifType.ERROR);
    }

    navigate("/user");
  };

  return (
    <div className="create-listing-div">
      <h1>Edit Listing</h1>
      <InputFileUpload handleImageUpload={handleImageUpload}></InputFileUpload>
      {base64 && <img src={base64} width={200} height={200} />}
      {imageName && <p>{imageName}</p>}

      <TextField
        label="Title"
        id="filled-basic"
        variant="filled"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        id="filled-textarea"
        label="Description"
        value={description}
        placeholder="Description"
        multiline
        variant="filled"
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <div className="location">
        <Autocomplete
          style={{
            border: ".05rem solid",
            borderRadius: ".25rem",
            width: "90%",
            fontSize: "1rem",
          }}
          value={location ? location.address : ""}
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={handlePlaceSelected}
          options={{
            types: ["address"],
          }}
          onChange={() => setLocation({})}
        />
        <TextField
          size="small"
          id="filled-basic"
          InputProps={{
            inputProps: { min: 1 },
          }}
          value={quantity}
          type="number"
          variant="filled"
          onChange={handleQuantityChange}
        />
      </div>

      <div className="details">
        <FormControl>
          <InputLabel id="conditionSelectLabel">Condition</InputLabel>
          <Select
            labelId="conditionSelectLabel"
            id="conditionSelect"
            value={condition}
            onChange={handleConditionSelected}
          >
            {conditionOptions.map(({ value, label }, index) => (
              <MenuItem key={index} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CustomAutocomplete
          multiple
          id="tags-categories"
          options={categoryOptions}
          value={categories}
          onChange={(event, value) => {
            setCategories(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Categories" placeholder="" />
          )}
        />
      </div>
      <Button
        color="error"
        variant="outlined"
        onClick={() => setDeleteModal(true)}
      >
        Delete Listing
      </Button>
      <Button variant="contained" onClick={submitListing} disabled={!canSubmit}>
        Submit
      </Button>
      <DeleteModal
        deleteListing={deleteListing}
        open={deleteModal}
        setOpen={setDeleteModal}
      ></DeleteModal>
    </div>
  );
};
