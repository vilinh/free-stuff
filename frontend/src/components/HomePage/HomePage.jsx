import { Chip } from "@mui/material";
import "./HomePage.css";
import Spinner from "@cloudscape-design/components/spinner";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadListings } from "../../utils/listingService";

export const HomePage = () => {
  const { address } = useLocationContext();
  const [locationListings, setLocationListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getListings = async () => {
      try {
        let res = await axios.get(
          `http://localhost:8000/listing?location=${address}`
        );
        loadListings(res, setLocationListings)
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
          <Chip
            onClick={() =>
              navigate({
                pathname: "/search",
                search: `?categories=Clothes`,
              })
            }
            label="Clothes"
            variant="filled"
          />
          <Chip
            onClick={() =>
              navigate({
                pathname: "/search",
                search: `?categories=Books`,
              })
            }
            label="Books"
            variant="filled"
          />
          <Chip
            onClick={() =>
              navigate({
                pathname: "/search",
                search: `?categories=Furniture`,
              })
            }
            label="Furniture"
            variant="filled"
          />
        </div>
      </div>
      <div className="featured-listings-div">
        {address ? (
          <h4>
            Showing listings in {address ? address?.split(",")[0] : <Spinner />}{" "}
          </h4>
        ) : (
          <h4>Select a location to show listings near that location</h4>
        )}
        <span className="near-you">Near you</span>
        <span className="sub-link" onClick={() => navigate("/search")}>
          {" "}
          See all
        </span>

        <div className="home-listings">
          {locationListings.map((listing, key) => (
            <ListingThumbnail listing={listing} key={key} editListing={false} />
          ))}
        </div>
      </div>
    </div>
  );
};
