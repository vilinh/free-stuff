import React from "react";
import "./App.css";
import { Listing, ListingPanel } from "./components/ListingPanel/ListingPanel";

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
  return (
    <div className="App">
      <ListingPanel listing={template_listing}></ListingPanel>
    </div>
  );
}

export default App;
