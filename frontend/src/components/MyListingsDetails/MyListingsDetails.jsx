import "./MyListingsDetails.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { getUserById } from "../../utils/userService";

const ListingDetailsTableRow = ({ listing }) => {
  const [claimeeUsers, setClaimeeUsers] = useState();
  useEffect(() => {
    async function getUsersinClaimQueue() {
      const usersInClaimQueue = await Promise.all(
        listing.claim_queue.map(async (uid) => {
          console.log(uid);
          const res = await getUserById(uid);
          if (res) {
            return res.data.email;
          }
        })
      );
      setClaimeeUsers(usersInClaimQueue.join(", "));
    }
    getUsersinClaimQueue();
  }, [listing.claim_queue]);
  return (
    <TableRow key={listing.title}>
      <TableCell component="th" scope="row">
        {listing.image && <img src={listing.image} width={50} height={50} />}
      </TableCell>
      <TableCell component="th" scope="row">
        {listing.title}
      </TableCell>
      <TableCell align="right">{listing.details.quantity}</TableCell>
      <TableCell align="right">{listing.claim_queue.length}</TableCell>
      <TableCell align="right">
        {claimeeUsers}
      </TableCell>
    </TableRow>
  );
};

const MyListingsDetails = () => {
  const [listings, setListings] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const getListings = async () => {
      try {
        let res = await axios.get(
          `http://localhost:8000/listing/user/${auth.currentUser.uid}`
        );
        console.log(res);

        let rows = res.data.map((listing) => ({
          image: listing.image,
          title: listing.title,
          quantity: listing.details.quantity,
          claimed_queue: listing.claimed_queue,
        }));
        console.log(rows);

        setListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getListings();
  }, []);

  return (
    <div className="mylistingsdetails-container">
      My Listings Details
      <div className="mylistingsdetails-table">
        <div style={{ height: 400, width: "100%" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right"># Claimed</TableCell>
                  <TableCell align="right">Claimed Queue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listings.map((listing) => (
                  <ListingDetailsTableRow listing={listing} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default MyListingsDetails;
