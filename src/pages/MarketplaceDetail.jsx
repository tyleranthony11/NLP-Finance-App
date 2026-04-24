import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MarketplaceDetail.css";
import { calculateBiWeekly, calculateWeekly, calculateMonthly } from "../utils";
import dealers from "../data/dealers";
import { Email, Phone, Share } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

export default function MarketplaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [secureOpen, setSecureOpen] = useState(false);
  const [secureMode, setSecureMode] = useState("options");
  const [financeForm, setFinanceForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    additionalInfo: "",
  });
  const [financeSubmitting, setFinanceSubmitting] = useState(false);
  const [financeFeedback, setFinanceFeedback] = useState({ type: "", message: "" });
  const [financeSubmitted, setFinanceSubmitted] = useState(false);

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
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const dealertrackUrl =
    "https://v2.digital.dealertrack.ca/creditapp/standalone?token=51e9767a-c539-4874-a757-41df6d590bc2&flow=Full&lang=en";

  const formatOdometer = (odoValue, odoUnit) => {
    if (odoValue === null || odoValue === undefined || odoValue === "")
      return "N/A";
    if (!odoUnit) return Number(odoValue).toLocaleString();

    const unitLabel =
      odoUnit === "km"
        ? "km"
        : odoUnit === "mi"
          ? "mi"
          : odoUnit === "hrs"
            ? "hrs"
            : odoUnit;

    return `${Number(odoValue).toLocaleString()} ${unitLabel}`;
  };

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
      title:
        listing.title || `${listing.year} ${listing.make} ${listing.model}`,
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

  const listingTitle =
    listing?.title || `${listing?.year} ${listing?.make} ${listing?.model}`;

  const normalizedVehicle = (listing?.category || "")
    .toString()
    .trim()
    .toLowerCase();

  const leadVehicle = ["powersports", "rv", "marine", "automotive"].includes(
    normalizedVehicle,
  )
    ? normalizedVehicle
    : "other";

  const leadSeller = (listing?.dealership || "Private Seller").trim();

  const resetSecureModal = () => {
    setSecureOpen(false);
    setSecureMode("options");
    setFinanceSubmitting(false);
    setFinanceSubmitted(false);
    setFinanceFeedback({ type: "", message: "" });
    setFinanceForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      additionalInfo: "",
    });
  };

  const handleFinanceFieldChange = (event) => {
    const { name, value } = event.target;
    setFinanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinanceSubmit = async (event) => {
    event.preventDefault();
    if (financeSubmitting) return;

    setFinanceSubmitting(true);
    setFinanceFeedback({ type: "", message: "" });
    setFinanceSubmitted(false);

    try {
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: financeForm.firstName.trim(),
          lastName: financeForm.lastName.trim(),
          phone: financeForm.phone.trim(),
          email: financeForm.email.trim(),
          location: financeForm.location.trim(),
          vehicle: leadVehicle,
          seller: leadSeller,
          additionalInfo: `Marketplace unit: ${listingTitle}${
            financeForm.additionalInfo.trim()
              ? `\n${financeForm.additionalInfo.trim()}`
              : ""
          }`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFinanceSubmitted(true);
        setFinanceFeedback({
          type: "success",
          message:
            "Submitted successfully. You can proceed to the full application or close and have us reach out.",
        });
      } else {
        setFinanceFeedback({
          type: "error",
          message: result.message || "Failed to submit application.",
        });
      }
    } catch (error) {
      console.error(error);
      setFinanceFeedback({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setFinanceSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className="marketplace-detail">
        <Button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Listings
        </Button>
        <Typography variant="h4" component="h2" gutterBottom>
          Loading listing...
        </Typography>
      </Box>
    );
  }

  if (!listing) {
    return (
      <Box className="marketplace-detail">
        <Button
          className="back-button"
          onClick={() => navigate("/marketplace")}
        >
          &larr; Back to Listings
        </Button>
        <Typography variant="h4" component="h2" gutterBottom>
          Listing not found
        </Typography>
        <Typography variant="body1">
          {loadError || "This listing may be sold or no longer available."}
        </Typography>
      </Box>
    );
  }
  const dealerEmail =
    dealerInfo?.email && dealerInfo.email.trim() !== ""
      ? dealerInfo.email
      : listing?.email && listing.email.trim() !== ""
        ? listing.email
        : "marketplace@nlpfinance.ca";
  return (
    <div className="marketplace-detail">
      <Button
        className="back-button"
        onClick={() => navigate("/marketplace")}
      >
        &larr; Back to Listings
      </Button>

      <Typography variant="h4" component="h2" gutterBottom>
        {listing.title || `${listing.year} ${listing.make} ${listing.model}`}
      </Typography>

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
          <Typography className="price" component="p">
            {Number(listing.price) > 0
              ? <>{`$${Number(listing.price).toLocaleString()}`}<span className="plus-hst">+ HST</span></>
              : "Contact for Price"}
          </Typography>

          {Number(customRate) > 0 && Number(customTerm) > 0 && (
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
                  Number(customRate),
                  Number(customTerm),
                )}{" "}
                / {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </div>
            </div>
          )}

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

          <Typography className="calculator-disclaimer" component="p">
            *Payment amount is an estimate for illustrative purposes only. HST
            and other fees not included. All clients are subject to credit
            approval.
          </Typography>

          <button
            type="button"
            className="apply-now-btn"
            onClick={() => {
              setSecureMode("options");
              setFinanceFeedback({ type: "", message: "" });
              setSecureOpen(true);
            }}
          >
            Secure This Unit
          </button>

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
          <Typography variant="h6" component="h3">
            Specifications
          </Typography>
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
            <strong>Condition:</strong>{" "}
            {listing.condition ? listing.condition.toUpperCase() : "N/A"}
          </div>
          <div>
            <strong>Odometer:</strong>{" "}
            {formatOdometer(listing.odometerValue, listing.odometerUnit)}
          </div>
        </div>

        {dealerInfo && (
          <div className="dealer-info">
            <Typography className="dealer-label" component="p">
              Offered by:
            </Typography>
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
            <Typography className="dealer-name" component="p">
              {dealerInfo.name}
            </Typography>
            <Typography className="dealer-location" component="p">
              {dealerInfo.location}
            </Typography>
          </div>
        )}
      </div>

      <div className="description">
        <Typography variant="h6" component="h4" gutterBottom>
          Description
        </Typography>
        <Typography component="p">{listing.description}</Typography>
      </div>
      {secureOpen && (
        <div className="secure-overlay" onClick={resetSecureModal}>
          <div className="secure-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="secure-close"
              onClick={resetSecureModal}
              aria-label="Close"
            >
              ✕
            </button>

            <Typography className="secure-title" variant="h4" component="h2">
              Secure This Unit
            </Typography>
            <Typography className="secure-subtitle" component="p">
              Select how you'd like to move forward.
            </Typography>

            <div className="secure-unit">
              <Typography className="secure-unit-title" component="h3" variant="h6">
                {listingTitle}
              </Typography>
              <Typography className="secure-unit-dealer" component="p">
                {listing.dealership || "Private Seller"}
              </Typography>
            </div>

            {secureMode === "options" ? (
              <div className="secure-options">
                <div className="secure-option">
                  <Typography component="h4" variant="subtitle1">
                    Contact the Selling Dealer
                  </Typography>
                  <Typography component="p">
                    Confirm availability and purchase details directly with the
                    dealer.
                  </Typography>

                  <a
                    className="secure-btn"
                    href={`mailto:${dealerEmail}?cc=marketplace@nlpfinance.ca&subject=${encodeURIComponent(
                      `Marketplace Inquiry: ${listingTitle}`,
                    )}&body=${encodeURIComponent(
                      `Hi,

I'm interested in this unit:

${listingTitle}
Price: ${Number(listing.price) > 0 ? `$${Number(listing.price).toLocaleString()}` : "Contact for Price"}

Listing Link:
${window.location.href}

Is it still available?

Thanks,`,
                  )}`}
                  >
                    Contact Dealer
                  </a>

                  <small>Your message goes directly to the selling dealer.</small>
                </div>

                <div className="secure-divider" />

                <div className="secure-option">
                  <Typography component="h4" variant="subtitle1">
                    Request Financing Support
                  </Typography>
                  <Typography component="p">
                    Structured financing support aligned with this purchase.
                  </Typography>

                  <button
                    className="secure-btn"
                    type="button"
                    onClick={() => {
                      setSecureMode("finance");
                    }}
                  >
                    Request Financing
                  </button>

                  <small>Your message goes directly to NLP Finance.</small>
                </div>
              </div>
            ) : (
              <div className="secure-finance-form-wrap">
                <Typography component="h4" variant="subtitle1">
                  Financing Request
                </Typography>

                <form className="secure-finance-form" onSubmit={handleFinanceSubmit}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={financeForm.firstName}
                    onChange={handleFinanceFieldChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={financeForm.lastName}
                    onChange={handleFinanceFieldChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={financeForm.email}
                    onChange={handleFinanceFieldChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={financeForm.phone}
                    onChange={handleFinanceFieldChange}
                    required
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location (Town/City)"
                    value={financeForm.location}
                    onChange={handleFinanceFieldChange}
                    required
                  />
                  <textarea
                    name="additionalInfo"
                    rows="4"
                    placeholder="Additional Info (Optional)"
                    value={financeForm.additionalInfo}
                    onChange={handleFinanceFieldChange}
                  />

                  {financeFeedback.message ? (
                    <p className={`secure-finance-feedback ${financeFeedback.type}`}>
                      {financeFeedback.message}
                    </p>
                  ) : null}

                  {financeSubmitted ? (
                    <div className="secure-finance-actions">
                      <button
                        className="secure-btn secure-btn-secondary"
                        type="button"
                        onClick={resetSecureModal}
                      >
                        Have Us Reach Out
                      </button>
                      <a
                        className="secure-btn"
                        href={dealertrackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Proceed to Full Application
                      </a>
                    </div>
                  ) : (
                    <div className="secure-finance-actions">
                      <button
                        className="secure-btn secure-btn-secondary"
                        type="button"
                        onClick={() => {
                          setSecureMode("options");
                          setFinanceFeedback({ type: "", message: "" });
                        }}
                      >
                        Back
                      </button>
                      <button className="secure-btn" type="submit" disabled={financeSubmitting}>
                        {financeSubmitting ? "Submitting..." : "Next"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
