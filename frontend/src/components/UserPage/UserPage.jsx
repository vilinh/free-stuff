import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { UserPanel } from "../UserPanel/UserPanel";
import Grid from "@mui/material/Grid";
import "./UserPage.css";

export const UserPage = () => {
  return (
    <div className="user-page">
      <div className="user-details">
        <UserPanel></UserPanel>
      </div>
      <div className="user-listings">
        <Grid container spacing={1}>
          <Grid item xs={3} md={2}>
            <ListingThumbnail></ListingThumbnail>
          </Grid>
          <Grid item xs={3} md={2}>
            <ListingThumbnail></ListingThumbnail>
          </Grid>
          <Grid item xs={3} md={2}>
            <ListingThumbnail></ListingThumbnail>
          </Grid>
          <Grid item xs={3} md={2}>
            <ListingThumbnail></ListingThumbnail>
          </Grid>
          <Grid item xs={3} md={2}>
            <ListingThumbnail></ListingThumbnail>
          </Grid>
          <Grid item xs={3} md={2}>
            <ListingThumbnail></ListingThumbnail>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};