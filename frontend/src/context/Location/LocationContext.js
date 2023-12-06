import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { getUserById, updateUserById } from "../../utils/userService";
const LocationContext = createContext();

export function useLocationContext() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }) {
  const { currentUser } = useAuth();
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({});
  const [loading, setLoading] = useState(false);

  function findLocation() {
    setLoading(true);
    async function getAddress(coords) {
      const lat = coords.lat;
      const lng = coords.lng;
      const request = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      try {
        const res = await axios.get(request);
        setAddress(res.data.results[0].formatted_address);
        await updateUserLocation(res.data.results[0].formatted_address, coords);
        setLoading(false);
      } catch (error) {
        console.log("could not fetch address");
      }
    }

    async function updateUserLocation(streetAddr, coords) {
      const loc = {
        location: {
          address: streetAddr,
          latitude: coords.lat,
          longitude: coords.lng,
        },
      };
      await updateUserById(currentUser.uid, loc);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ latitude, longitude });
        getAddress({ lat: latitude, lng: longitude });
      });
    }
  }

  const value = {
    address,
    location,
    setLocation,
    findLocation,
    setAddress,
    loading,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
