import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MarketplaceDetail.css";
import { calculateBiWeekly, calculateWeekly, calculateMonthly } from "../utils";
import dealers from "../data/dealers";
import { Email, Phone, Share } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function MarketplaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const listings = JSON.parse(localStorage.getItem("listings") || "[]");
  const listing = listings.find(
    (l) => l.id.toString() === id && l.status === "active"
  );
  const dealerInfo = listing.dealership ? dealers[listing.dealership] : null;
  const [downPayment, setDownPayment] = useState("");
  const [customPrice, setCustomPrice] = useState(listing.price);
  const [customRate, setCustomRate] = useState(listing.interestRate);
  const [customTerm, setCustomTerm] = useState(listing.term);
  const [frequency, setFrequency] = useState("bi-weekly");
  const minRate = 5.29;
  const maxRate = 24.99;

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const mainImage = listing.photos[mainImageIndex];

  const handleImageNav = (direction) => {
    const total = listing.photos.length;
    const newIndex = (mainImageIndex + direction + total) % total;
    setMainImageIndex(newIndex);
  };

  const handleShare = () => {
    const shareData = {
      title: `${listing.year} ${listing.make} ${listing.model}`,
      text: "Check out this listing on NLP Finance Marketplace!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard!");
      });
    }
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
            <button
              className="image-arrow left"
              onClick={() => handleImageNav(-1)}
              aria-label="Previous Image"
            >
              &#10094;
            </button>
            <a href={mainImage} target="_blank" rel="noopener noreferrer">
              <img className="main-image" src={mainImage} alt="Main unit" />
            </a>
            <button
              className="image-arrow right"
              onClick={() => handleImageNav(1)}
              aria-label="Next Image"
            >
              &#10095;
            </button>
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

          <div className="estimated-payment">
            <div className="label">Estimated Payment:</div>
            <div className="main-payment-amount">
              $
              {{
                "bi-weekly": calculateBiWeekly,
                weekly: calculateWeekly,
                monthly: calculateMonthly,
              }[frequency](
                customPrice - Number(downPayment || 0),
                customRate,
                customTerm
              )}{" "}
              / {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </div>
          </div>
          <div className="payment-calculator">
            <label>
              Product Price ($):
              <input
                type="number"
                min="0"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
              />
            </label>

            <label>
              Down Payment ($):
              <input
                type="number"
                min="0"
                max={customPrice}
                value={downPayment}
                onChange={(e) => {
                  const value = e.target.value;
                  if (Number(value) <= customPrice) {
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
              Payment Frequency:
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>

            <label>
              Term (months):
              <select
                value={customTerm}
                onChange={(e) => setCustomTerm(Number(e.target.value))}
              >
                {[...Array(16)].map((_, i) => {
                  const months = 60 + i * 12;
                  return (
                    <option key={months} value={months}>
                      {months}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <p className="calculator-disclaimer">
            *Payment amount is an estimate for illustrative purposes only. HST
            and other fees not included. All clients are subject to credit
            approval.
          </p>

          <a href="/finance" target="_blank" className="apply-now-btn">
            Apply Now
          </a>

          <div className="contact-actions">
            {listing.email && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Email />}
                href={`mailto:${listing.email}?cc=marketplace@nlpfinance.ca`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Email Seller
              </Button>
            )}

            {listing.phone && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Phone />}
                href={`tel:${listing.phone}`}
              >
                Call Seller
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              startIcon={<Share />}
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        </div>
      </div>
      <div className="info-row">
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
          <div>
            <strong>Odometer:</strong> {listing.kms} km
          </div>
        </div>

        {dealerInfo && (
          <div className="dealer-info">
            <p className="dealer-label">Offered by:</p>
            <div className="dealer-logo-wrapper">
              <a
                href={dealerInfo.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={dealerInfo.logo}
                  alt={`${dealerInfo.name} logo`}
                  className="dealer-logo"
                />
              </a>
            </div>
            <p className="dealer-name">{dealerInfo.name}</p>
            <p className="dealer-location">{dealerInfo.location}</p>
          </div>
        )}
      </div>

      <div className="description">
        <h4>Description</h4>
        <p>{listing.description}</p>
      </div>
    </div>
  );
}
