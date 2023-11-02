import "./UserPanel.css";
import { useState, useEffect } from "react";
import axios from "axios";

let template_user = {
  _id: "12345",
  display_name: "Char Lee",
  user_name: "charlee123",
  profile_pic:
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
};

export const UserPanel = () => {

  const [address, setAddress] = useState("");

  useEffect(() => {
    async function getAddress(coords) {
      const lat = coords.lat;
      const lng = coords.lng;
      const request = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      try {
        const res = await axios.get(request);
        setAddress(res.data.results[0].formatted_address);
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
  }, [])

  return (
    <div className="user-panel">
      <div className="user-l">
        <img className="user-pfp" src={template_user.profile_pic} />
      </div>
      <div className="user-r">
        <span className="user-name">User Name</span>
        <span className="user-details">{address.split(",")[0]} | # listed # given</span>
      </div>
    </div>
  );
};
