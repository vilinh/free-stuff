import { ListingPanel } from "../ListingPanel/ListingPanel";
import { UserPanel } from "../UserPanel/UserPanel";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ListingPage.css";

export const ListingPage = ({ listing }) => {
  const [listings, setListings] = useState([])

  useEffect(() => {
    const getListings = async () => {
      try {
				let res = await axios.get("http://localhost:8000/listing");
				setListings(res.data.listings);
			} catch (error) {
				console.log(error);
			}
    }
    getListings();
  }, [])

  return (
    <div className="listing-page">
      {/* <ListingPanel listing={listing}></ListingPanel> */}
      {listings.map((listing, key) => (
        <ListingPanel listing={listing} key={key}/>
      ))}
      <UserPanel></UserPanel>
    </div>
  );
};
