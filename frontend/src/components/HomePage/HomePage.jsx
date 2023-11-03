import { Chip, CircularProgress } from "@mui/material";
import "./HomePage.css";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";

export const HomePage = () => {
  const { address } = useLocationContext() 
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
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
          <div style={{backgroundColor: "lightblue", width: "8rem", height: "8rem"}}></div>
        </div>
      </div>
    </div>
  );
};
