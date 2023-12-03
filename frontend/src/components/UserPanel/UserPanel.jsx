import { getUserById } from "../../utils/userService";
import "./UserPanel.css";
import { useEffect, useState } from "react";

export const UserPanel = ({ user, listings }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProf, setUserProf] = useState({});
  // const [hasUsername, setHasUsername] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      let response = await getUserById(user.uid);
      setUserProf(response["data"]);
      setIsLoading(false);
    };
    getUser();
  }, [user.uid]);

  if (isLoading) {
    return;
  }

  return (
    <div className="user-panel">
      <div className="user-l">
        <img
          className="user-pfp"
          src={
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
        />
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
