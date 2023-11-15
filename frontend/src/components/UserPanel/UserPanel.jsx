import "./UserPanel.css";
let template_user = {
  _id: "12345",
  display_name: "Char Lee",
  user_name: "charlee123",
  profile_pic:
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
};

export const UserPanel = ({ username, listings }) => {
  return (
    <div className="user-panel">
      <div className="user-l">
        <img className="user-pfp" src={template_user.profile_pic} />
      </div>
      <div className="user-r">
        <span className="user-name">{username}</span>
        <span className="user-details">
          user-defined location
          | {listings ?? "0"} listings
        </span>
      </div>
    </div>
  );
};
