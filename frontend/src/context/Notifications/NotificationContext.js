import { createContext, useContext, useEffect, useState } from "react";
const NotifContext = createContext();

export const NotifMsg = {
  CREATE_LISTING_SUCCESS: "Listing Successfully Created",
  CREATE_LISTING_ERROR: "Failed to Create Listing",
  EDIT_LISTING_SUCCESS: "Listing Successfully Updated",
  EDIT_LISTING_ERROR: "Failed to Update Listing",
  DELETE_LISTING_SUCCESS: "Listing Successfully Deleted",
  DELETE_LISTING_ERROR: "Failed to Delete Listing",
  LOGIN_ERROR: "Email or Password Incorrect",
  LOCATION_ERROR: "Please Set a Location To Filter By Distance"
}

export const NotifType = {
  SUCCESS: "success",
  ERROR: "error"
}

export function useNotif() {
  return useContext(NotifContext);
}

export function NotifProvider({ children }) {
  const [notif, setNotif] = useState(false);
  const [notifObj, setNotifObj] = useState({message: "", type: ""});
  const [createListingErr, setCreateListingErr] = useState(false);

  function createNotif(msg, type) {
    setNotifObj({message: msg, type: type})
    setNotif(true)
  }

  function closeNotif(){
    setNotifObj({message: "", type: ""})
    setNotif(false)
  }

  const value = {
    notif,
    notifObj,
    createNotif,
    closeNotif
  };

  return (
    <NotifContext.Provider value={value}>
      {children}
    </NotifContext.Provider>
  );
}

export default NotifContext;
