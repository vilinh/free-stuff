import React from "react";
import "./App.css";
import SignUp from "./components/SignUpPage/SignUp";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ListingPage } from "./components/ListingPage/ListingPage";
import { UserPage } from "./components/UserPage/UserPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "./context/Auth/AuthContext";
import LoginPage from "./components/LoginPage/LoginPage";
import { NavBar } from "./components/Nav/NavBar";
import CreateListing from "./components/CreateListing/CreateListing";
import { HomePage } from "./components/HomePage/HomePage";
import { EditListing } from "./components/EditListing/EditListing";

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
				<Route path="/" element={<HomePage></HomePage>} />
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
				<Route
					path="/createListing"
					element={
						<ProtectedRoute user={currentUser}>
							<CreateListing />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/editListing/:id"
					element={
						<ProtectedRoute user={currentUser}>
							<EditListing />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
export default App;
