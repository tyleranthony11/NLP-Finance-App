import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MarketplaceDetail.css";
import { calculateBiWeekly, calculateWeekly, calculateMonthly } from "../utils";
import dealers from "../data/dealers";
import { Email, Phone, Share } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function MarketplaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [downPayment, setDownPayment] = useState("");
  const [customPrice, setCustomPrice] = useState(0);
  const [customRate, setCustomRate] = useState(0);
  const [customTerm, setCustomTerm] = useState(0);
  const [frequency, setFrequency] = useState("bi-weekly");
  const minRate = 5.29;
  const maxRate = 24.99;

  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/marketplace/${id}`,
        );
        const json = await res.json();

        if (!res.ok || !json.success) {
          setListing(null);
          setLoadError(json.message || "Listing not found");
          return;
        }

        setListing(json.data);

        setCustomPrice(Number(json.data.price || 0));
        setCustomRate(Number(json.data.interestRate || 0));
        setCustomTerm(Number(json.data.term || 0));
        setDownPayment("");
        setMainImageIndex(0);
      } catch (err) {
        console.error("Failed to load listing", err);
        setListing(null);
        setLoadError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  const dealerInfo = useMemo(() => {
    if (!listing) return null;
    return listing.dealership ? dealers[listing.dealership] : null;
  }, [listing]);

  const photos = listing?.photos || [];
  const mainImage = photos[mainImageIndex] || "";

  const handleImageNav = (direction) => {
    const total = photos.length;
    if (!total) return;
    const newIndex = (mainImageIndex + direction + total) % total;
    setMainImageIndex(newIndex);
  };

  const handleShare = () => {
    if (!listing) return;

    const shareData = {
      title: `${listing.year} ${listing.make} ${listing.model}`,
      text: "Check out this listing on NLP Finance Marketplace!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((err) => console.error("Share error:", err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard!");
      });
    }
  };

  if (loading) {
    return (
      <div className="marketplace-detail">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Listings
        </button>
        <h2>Loading listing...</h2>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="marketplace-detail">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Listings
        </button>
        <h2>Listing not found</h2>
        <p>{loadError || "This listing may be sold or no longer available."}</p>
      </div>
    );
  }

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

            {mainImage ? (
              <a href={mainImage} target="_blank" rel="noopener noreferrer">
                <img className="main-image" src={mainImage} alt="Main unit" />
              </a>
            ) : (
              <div
                className="main-image"
                style={{ display: "grid", placeItems: "center" }}
              >
                No image
              </div>
            )}

            <button
              className="image-arrow right"
              onClick={() => handleImageNav(1)}
              aria-label="Next Image"
            >
              &#10095;
            </button>
          </div>

          <div className="thumbnail-row">
            {photos.map((url, idx) => (
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
            ${Number(listing.price || 0).toLocaleString()}
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
                Number(customPrice || 0) - Number(downPayment || 0),
                Number(customRate || 0),
                Number(customTerm || 0),
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
                  if (Number(value) <= Number(customPrice || 0)) {
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

          <a
            href="/finance"
            target="_blank"
            className="apply-now-btn"
            rel="noreferrer"
          >
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
