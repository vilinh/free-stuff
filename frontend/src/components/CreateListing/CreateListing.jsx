import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { convertBase64, postImage } from "../../utils/imageService";
import {
	categoryOptions,
	conditionOptions,
	postListing,
} from "../../utils/listingService";
import Autocomplete from "react-google-autocomplete";
import CustomAutocomplete from "@mui/material/Autocomplete";
import "./CreateListing.css";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import InputFileUpload from "../InputFileUpload/InputFileUpload";
import { NotifMsg, NotifType, useNotif } from "../../context/Notifications/NotificationContext";

const CreateListing = () => {
  const { currentUser } = useAuth();
  const { createNotif } = useNotif();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [location, setLocation] = useState();
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    // check for valid form input
    console.log(condition)
    if (
      !title ||
      !description ||
      categories.length === 0 ||
      condition === "" ||
      !image ||
      !location
    ) {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
  }, [title, description, categories, quantity, condition, image, location]);
	
  const submitListing = async () => {
    setCanSubmit(false);

    /* get imageId after posting to database */
    const imageRes = await postImage({
      base64: image,
      name: imageName
    });

    const details = {
      quantity: quantity,
      condition: condition,
      posted_date: new Date(),
      categories: categories,
    };
    const listing = {
      title: title,
      location: location,
      description: description,
      user_id: currentUser.uid,
      claimed: false,
      details: details,
      image: imageRes.data._id,
    };
    await postListing(listing);

    createNotif(NotifMsg.CREATE_LISTING_SUCCESS, NotifType.SUCCESS)
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
        coordinates: [longitude, latitude]
      }
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
    if (file) {
      const base64 = await convertBase64(file);
      setImage(base64);
      setImageName(file.name)
    }
  };

  return (
    <div className="create-listing-div">		
      <h1>List an Item</h1>
      <InputFileUpload handleImageUpload={handleImageUpload}></InputFileUpload>
      {image && <img src={image} width={200} height={200} />}
      {imageName && <p>{imageName}</p>}

      <TextField
        id="filled-basic"
        label="Title"
        variant="filled"
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        id="filled-textarea"
        label="Description"
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
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={handlePlaceSelected}
          options={{
            types: ["address"],
          }}
          onChange={() => setLocation()}
        />
        <TextField
          size="small"
          id="filled-basic"
          label="Quantity"
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
          defaultValue={[]}
          onChange={(event, value) => {
            setCategories(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Categories" placeholder="" />
          )}
        />
      </div>

      <Button variant="contained" onClick={submitListing} disabled={!canSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default CreateListing;
