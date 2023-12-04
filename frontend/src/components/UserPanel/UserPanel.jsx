import { getUserById } from "../../utils/userService";
import "./UserPanel.css";
import { useEffect, useState } from "react";
import { getImageFromId } from "../../utils/imageService";

export const UserPanel = ({ uid, listings }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProf, setUserProf] = useState({});
  const [image, setImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
  );

  useEffect(() => {
    const getImage = async () => {
      if (Object.hasOwn(userProf, "profile_pic") && userProf.profile_pic) {
        const res = await getImageFromId(userProf.profile_pic);
        if (res) {
          setImage(res.data.base64);
        }
      }
    };
    const getUser = async () => {
      let response = await getUserById(uid);
      setUserProf(response["data"]);
      setIsLoading(false);
    };
    getUser();
    getImage();
  }, [uid, userProf]);

  if (isLoading) {
    return;
  }

  return (
    <div className="user-panel">
      <div className="user-l">
        <img className="user-pfp" src={image} />
      </div>
      <div className="user-r">
        <span className="user-loc">
          {userProf.display_location ? userProf.display_location : ""}
        </span>
        <span className="user-name">
          {userProf.display_name ? userProf.display_name : userProf.email}
        </span>
        <span className="user-details">
          {userProf.display_name ? userProf.email : ""}
        </span>
        <span className="user-details">
          {listings ?? "0"} {listings === 1 ? "listing" : "listings"}
        </span>
        <span className="user-details">{userProf.biography}</span>
      </div>
    </div>
  );
};
