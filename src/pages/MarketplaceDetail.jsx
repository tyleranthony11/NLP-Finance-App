import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import dummyListings from "../data/dummyListings";
import { calculateBiWeekly } from "../utils";
import "./MarketplaceDetail.css";

function MarketplaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = dummyListings.find((item) => item.id === parseInt(id));

  if (!listing) {
    return <p>Listing not found.</p>;
  }

  return (
    <div className="marketplace-detail">
      <button className="back-button" onClick={() => navigate(-1)}>&larr; Back to Listings</button>

      <h2>{listing.year} {listing.make} {listing.model}</h2>
      <div className="images">
        {listing.photos.map((url, idx) => (
          <img key={idx} src={url} alt={`${listing.make} ${listing.model} ${idx + 1}`} />
        ))}
      </div>
      <p><strong>Price:</strong> ${listing.price.toLocaleString()}</p>
      <p><strong>Bi-Weekly Payment:</strong> ${calculateBiWeekly(listing.price, listing.rate, listing.termMonths)}</p>
      <p><strong>Terms:</strong> {listing.termMonths} months at {listing.rate}% APR</p>
      <p><strong>Seller:</strong> {listing.dealership ? "Dealership" : "Private Seller"}</p>
      <p><strong>Description:</strong> {listing.description}</p>
    </div>
  );
}

export default MarketplaceDetail;