import React, { useEffect } from "react";
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
import ListingDetail from "./components/ListingDetail/ListingDetail";
import { SearchResults } from "./components/SearchResults/SearchResults";
import ClaimedListing from "./components/ClaimedListingPage/ClaimedListing";

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
					path="/listing/:id"
					element={
						<ProtectedRoute user={currentUser}>
							<ListingDetail />
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
				<Route
					path="/search"
					element={
						<ProtectedRoute user={currentUser}>
							<SearchResults />
            </ProtectedRoute>}
        />
        <Route
					path="/claimedListing"
					element={
						<ProtectedRoute user={currentUser}>
							<ClaimedListing />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
export default App;
