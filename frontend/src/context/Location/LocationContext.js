import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const LocationContext = createContext();

export function useLocationContext() {
    return useContext(LocationContext);
  }

export function LocationProvider({ children }) {
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)

    function findLocation() {
      setLoading(true)
      async function getAddress(coords) {
        const lat = coords.lat;
        const lng = coords.lng;
        const request = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
        try {
          const res = await axios.get(request);
          setAddress(res.data.results[0].formatted_address);
          setLoading(false)
        } catch (error) {
          console.log("could not fetch address");
        }
      }
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          getAddress({ lat: latitude, lng: longitude });
        });
      }
    }

    const value = {
        address,
        findLocation,
        setAddress,
        loading
    }

    return (
        <LocationContext.Provider value={value}>
          {children}
        </LocationContext.Provider>
      );

}