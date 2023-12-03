import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { UserPage } from "../UserPage/UserPage";

export default function UserDetail() {
  const { uid } = useParams();
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        let res = await axios.get(`http://localhost:8000/user/${uid}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUser(uid);
  }, []);

  return <div>{user ? <UserPage uid={uid} /> : <CircularProgress />}</div>;
}
