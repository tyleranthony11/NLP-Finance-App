import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MarketplaceDetail.css";
import { calculateBiWeekly } from "../utils";
import dummyListings from "../data/dummyListings";

export default function MarketplaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const listing = dummyListings.find((l) => l.id.toString() === id);
  const [downPayment, setDownPayment] = useState("");
  const [customRate, setCustomRate] = useState(listing.rate);
  const [customTerm, setCustomTerm] = useState(listing.termMonths);
  const minRate = 5.29;
const maxRate = 24.99;

  
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const mainImage = listing.photos[mainImageIndex];

  const handleImageNav = (direction) => {
    const total = listing.photos.length;
    const newIndex = (mainImageIndex + direction + total) % total;
    setMainImageIndex(newIndex);
  };

  return (
    <div className="marketplace-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back to Listings
      </button>
      <h2>
        {listing.year} {listing.make} {listing.model}
      </h2>

      <div className="detail-layout">
        <div className="image-gallery">
          <div className="main-image-wrapper">
            <button className="image-arrow left" onClick={() => handleImageNav(-1)} aria-label="Previous Image">&#10094;</button>
            <a href={mainImage} target="_blank" rel="noopener noreferrer"><img className="main-image" src={mainImage} alt="Main unit" /></a>
            <button className="image-arrow right" onClick={() => handleImageNav(1)} aria-label="Next Image">&#10095;</button>
          </div>
          
          <div className="thumbnail-row">
            {listing.photos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImageIndex(idx)}
                className={idx === mainImageIndex ? "active-thumbnail" : ""}
              />
            ))}
          </div>
        </div>

        <div className="detail-sidebar">
          <p className="price">
            ${listing.price.toLocaleString()}
            <span className="plus-hst">+ HST</span>
          </p>
      
            <div className="payment-calculator">
              <label>
                Down Payment ($):
                <input
                  type="number"
                  min="0"
                  max={listing.price}
                  value={downPayment}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) <= listing.price) {
                      setDownPayment(value);
                    }
                  }}
                />
              </label>
             <label>
  Interest Rate (%):
  <input
    type="number"
    value={customRate}
    onChange={(e) => setCustomRate(e.target.value)} 
    onBlur={() => {
      const value = parseFloat(customRate);
      if (!isNaN(value)) {
        const clamped = Math.min(Math.max(value, minRate), maxRate);
        setCustomRate(clamped.toFixed(2));
      }
    }}
    step="0.01"
  />
</label>
              <label>
                Term (months):
                <select
                  value={customTerm}
                  onChange={(e) => setCustomTerm(Number(e.target.value))}
                >
                  <option value={60}>60</option>
                  <option value={72}>72</option>
                  <option value={84}>84</option>
                  <option value={96}>96</option>
                  <option value={108}>108</option>
                  <option value={120}>120</option>
                  <option value={132}>132</option>
                  <option value={144}>144</option>
                  <option value={156}>156</option>
                  <option value={168}>168</option>
                  <option value={180}>180</option>
                  <option value={192}>192</option>
                  <option value={204}>204</option>
                  <option value={216}>216</option>
                  <option value={228}>228</option>
                  <option value={240}>240</option>
                </select>
              </label>

              <p className="estimated-payment">
                <strong>Estimated Payment:</strong> $
                {calculateBiWeekly(
                  listing.price - Number(downPayment || 0),
                  customRate,
                  customTerm
                )}
                <span className="plus-hst">+ HST</span> bi-weekly
              </p>
            </div>
  
          <a href="/finance" className="apply-now-btn">Apply Now</a>
        </div>
      </div>

      <div className="specs">
        <h3>Specifications</h3>
        <div>
          <strong>Year:</strong> {listing.year}
        </div>
        <div>
          <strong>Make:</strong> {listing.make}
        </div>
        <div>
          <strong>Model:</strong> {listing.model}
        </div>
      </div>

      <div className="description">
        <h4>Description</h4>
        <p>{listing.description}</p>
      </div>
    </div>
  );
}
