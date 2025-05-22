import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MarketplaceDetail.css";
import { calculateBiWeekly } from "../utils";
import dummyListings from "../data/dummyListings"; // or wherever your data comes from

export default function MarketplaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const listing = dummyListings.find((l) => l.id.toString() === id);

  const [mainImage, setMainImage] = useState(listing.photos[0]);

  return (
    <div className="marketplace-detail">
      <button className="back-button" onClick={() => navigate(-1)}>&larr; Back to Listings</button>
      <h2>{listing.year} {listing.make} {listing.model}</h2>

      <div className="detail-layout">
        <div className="image-gallery">
          <img className="main-image" src={mainImage} alt="Main unit" />
          <div className="thumbnail-row">
            {listing.photos.map((url, idx) => (
              <img 
                key={idx}
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImage(url)}
              />
            ))}
          </div>
        </div>

        <div className="detail-sidebar">
          <p className="price">${listing.price.toLocaleString()}</p>
          <p><strong>Bi-Weekly Payment:</strong> ${calculateBiWeekly(listing.price, listing.rate, listing.termMonths)}</p>
          <p><strong>Terms:</strong> {listing.termMonths} months @ {listing.rate}%</p>
          <p><strong>Seller:</strong> {listing.dealership ? "Dealership" : "Private Seller"}</p>
        </div>
      </div>

      <div className="description">
        <h4>Description</h4>
        <p>{listing.description}</p>
      </div>
    </div>
  );
}
