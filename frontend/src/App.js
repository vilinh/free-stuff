import React, { useState, useEffect } from "react";
import "./App.css";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Link, Outlet, useFetcher, useRouteLoaderData } from "react-router-dom";
import { ListingPage } from "./components/ListingPage/ListingPage";
import { UserPage } from "./components/UserPage/UserPage";

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

function AuthStatus() {
  let { user } = useRouteLoaderData("root");
  let fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in</p>;
  }

  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome {user}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/signup">Signup Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
        <li>
          <Link to="/profile">My Profile</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

export default App;
