import React, { useState, useEffect } from "react";
import "./App.css";
import { Listing, ListingPanel } from "./components/ListingPanel/ListingPanel";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from "./firebase";

let template_listing = {
  title: "T-shirt",
  user_id: "12345",
  claimed: false,
  claim_queue: [""],
  details: {
    quantity: 1,
    condition: "new",
    categories: ["clothes"],
    posted_date: "010123",
  },
  description: "brand new tshirt",
  image:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHNoaXJ0fGVufDB8fDB8fHww",
};

function App() {
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user)
      } else {
        setAuthUser(null)
      }
    })

    return () => {
      listen();
    }
  }, []);

  const userSignOut = () => {
    signOut(auth).then(() => {
      console.log('sign out successful')
    }).catch(error => console.log(error))
  }

  return (
    <div className="App">
      {authUser == null ? 
        <div>
          <SignIn />
          <SignUp />
        </div>
        : 
        <div>
          <ListingPanel listing={template_listing}></ListingPanel>
          <button onClick={userSignOut}>Sign Out</button>
        </div>
      }
    </div>
  );
}

export default App;
