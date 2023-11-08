import { Chip, CircularProgress } from "@mui/material";
import "./HomePage.css";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";
import { useEffect, useState } from "react";
import axios from "axios";

export const HomePage = () => {
  const { address } = useLocationContext() 
  const [locationListings, setLocationListings] = useState([]);

  useEffect(() => {
    const getListings = async () => {
      try {
        let res = await axios.get(
          `http://localhost:8000/listing?location=${address}`
        );
        setLocationListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getListings();
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <h3>One man's trash is another man's treasure!</h3>
        <div className="cat-buttons">
          <Chip onClick={() => {}} label="Clothes" variant="filled" />
          <Chip onClick={() => {}} label="Books" variant="filled" />
          <Chip onClick={() => {}} label="Furniture" variant="filled" />
        </div>
      </div>
      <div className="featured-listings-div">
        <h4>Showing listings in {address ? address?.split(",")[0] : <CircularProgress />} </h4>

        <span className="near-you">Near you</span>
        <span className="sub-link"> See all</span>

        <div className="listings">
          {locationListings.map((listing, key) => (
            <ListingThumbnail 
              listing={listing} 
              key={key}
              editListing={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
