import { getUserById } from "../../utils/userService";
import "./UserPanel.css";
import { useEffect, useState } from "react";
let template_user = {
	_id: "12345",
	display_name: "Char Lee",
	user_name: "charlee123",
	profile_pic:
		"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
};

export const UserPanel = ({ user, listings }) => {
	const [location, setLocation] = useState();
  const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			const { data } = await getUserById(user.uid);
			setLocation(data.location?.address);
      setIsLoading(false);
		};
		getUser();
	}, []);

  if (isLoading) {
    return
  }

	return (
		<div className="user-panel">
			<div className="user-l">
				<img className="user-pfp" src={template_user.profile_pic} />
			</div>
			<div className="user-r">
				<span className="user-name">{user.email}</span>
				<span className="user-details">
					{location}
				</span>
        <span className="user-details">
          {listings ?? "0"} {listings === 1 ? "listing" : "listings"}
        </span>
			</div>
		</div>
	);
};
