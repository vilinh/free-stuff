import { ListingPanel } from "../ListingPanel/ListingPanel";
import { UserPanel } from "../UserPanel/UserPanel";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import "./ListingPage.css";

export const ListingPage = ({ listing }) => {
  const [listings, setListings] = useState([])
  const location = useLocation();

  useEffect(() => {
    const getListings = async () => {
      try {
        let res = await axios.get("http://localhost:8000/listing" + location.search);
        setListings(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    getListings();
  }, [])

  return (
    <div className="listing-page">
      <UserPanel></UserPanel>
      {listings && listings.map((listing, key) => (
        <ListingPanel listing={listing} key={key}/>
      ))}
    </div>
  );
};
