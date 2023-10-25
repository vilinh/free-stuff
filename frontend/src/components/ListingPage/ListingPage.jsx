import { ListingPanel } from "../ListingPanel/ListingPanel";
import { UserPanel } from "../UserPanel/UserPanel";
import "./ListingPage.css";

export const ListingPage = ({ listing }) => {
  return (
    <div className="listing-page">
      <ListingPanel listing={listing}></ListingPanel>
      <UserPanel></UserPanel>
    </div>
  );
};
