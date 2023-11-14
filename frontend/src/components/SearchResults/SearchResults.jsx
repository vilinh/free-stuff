import "./SearchResults.css";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";
import { useEffect, useState } from "react";
import RadioGroup from "@cloudscape-design/components/radio-group";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import axios from "axios";

export const SearchResults = () => {
  const [locationListings, setLocationListings] = useState([]);
  const [status, setStatus] = useState("any");

  const { address } = useLocationContext();

  useEffect(() => {
    const getListings = async () => {
      try {
        let res = await axios.get(
          `http://localhost:8000/listing?location=${address}`,
        );
        setLocationListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getListings();
  }, []);

  return (
    <div className="search-results">
      <div className="search-bar">

      </div>
      {/* <div className="cat-bar">
        <button className="cat-bar-button">Clothes</button>
        <button className="cat-bar-button">Books</button>
        <button className="cat-bar-button">Furniture</button>
      </div> */}

      <h3 className="search-results-title">Search results</h3>
      <div className="search-results-main">
        <div className="filter-bar">
          <h4>Filter By</h4>
          <hr />
          <div className="status">
            <h4>Status</h4>
            <div className="status-buttons">
              <RadioGroup
                onChange={({ detail }) => setStatus(detail.value)}
                value={status}
                items={[
                  { value: "any", label: "Any" },
                  { value: "claimed", label: "Claimed" },
                  { value: "unclaimed", label: "Unclaimed" },
                ]}
              />
            </div>
            <hr />
            <div className="category">
              <h4>Category</h4>
              <div className="category-options">
                <span className="cat-opt">Clothes</span>
                <span className="cat-opt">Books</span>
                <span className="cat-opt">Furniture</span>
              </div>
            </div>
          </div>
        </div>
        <div className="results">
        <ButtonDropdown className="sort-button"
      items={[
        { text: "Date Posted", id: "date", disabled: false },
        { text: "Location", id: "l", disabled: false },
      ]}
    >
      Sort By
    </ButtonDropdown>
          <div className="listings">
            {locationListings.map((listing, key) => (
              <ListingThumbnail
                listing={listing}
                key={key}
                editListing={false}
              />
            ))}
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
    </div>
  );
};
