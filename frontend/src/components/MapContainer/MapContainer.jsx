import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, Market, useLoadScript } from '@react-google-maps/api';
import axios from "axios";
import "./MapContainer.css";

const API_KEY = "";

const getAddress = async (coords) => {
  const lat = coords.lat;
  const lng = coords.lng;
  const request = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
  console.log("Request");
  try {
    let res = await axios.get(request);
    console.log(res.data);
    console.log(res.data.results[0]);
  } catch {
    console.log("could not fetch address");
  }
}

const MapContainer = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  const [location, setLocation] = useState({});
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ lat: latitude, lng:longitude });
      });
    }
    console.log(location);
  }, [])

  useEffect(() => {
    getAddress(location);
  }, [location]) 

  return (
    <div className="MapContainer">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={location}
            zoom={10}
          />
      )}
    </div>
  );
};

export default MapContainer;