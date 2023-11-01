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

export const UserPanel = ({ address }) => {

  return (
    <div className="user-panel">
      <div className="user-l">
        <img className="user-pfp" src={template_user.profile_pic} />
      </div>
      <div className="user-r">
        <span className="user-name">User Name</span>
        <span className="user-details">{address} | # listed # given</span>
      </div>
    </div>
  );
};
