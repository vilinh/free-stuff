import React from "react";
import "./App.css";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ListingPage } from "./components/ListingPage/ListingPage";
import { UserPage } from "./components/UserPage/UserPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "./context/Auth/AuthContext";
import LoginPage from "./components/LoginPage/LoginPage";
import { NavBar } from "./components/Nav/NavBar";

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
  const { currentUser } = useAuth();

  return (
    <BrowserRouter basename="/">
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<TempPublicPage></TempPublicPage>} />
        <Route path="/logincomp" element={<SignIn></SignIn>} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/signup" element={<SignUp user={currentUser}></SignUp>} />
        <Route
          path="/user"
          element={
            <ProtectedRoute user={currentUser}>
              <UserPage></UserPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/listing"
          element={
            <ProtectedRoute user={currentUser}>
              <ListingPage listing={template_listing}></ListingPage>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function TempPublicPage() {
  return (
    <div>
      temp home page placeholder
      
    </div>
  );
}

export default App;
