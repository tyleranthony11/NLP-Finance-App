import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { calculateBiWeekly } from "../utils";
import "./Marketplace.css";

function Marketplace() {
  const [sortKey, setSortKey] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [selectedDealers, setSelectedDealers] = useState([]);
  const [inventoryListings, setInventoryListings] = useState([]);

  useEffect(() => {
    const fetchActiveListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/marketplace`,
        );
        const json = await res.json();

        if (!json.success) {
          console.error("Failed to load marketplace listings", json);
          return;
        }

        const active = (json.data || []).filter(
          (item) => item.status === "active",
        );
        setInventoryListings(active);
      } catch (err) {
        console.error("Failed to load marketplace listings", err);
      }
    };

    fetchActiveListings();
  }, []);

  const allDealers = Array.from(
    new Set(
      inventoryListings.map((item) => item.dealership || "Private Seller"),
    ),
  ).filter(Boolean);

  const filteredListings = inventoryListings.filter((item) => {
    const dealerName = item.dealership || "Private Seller";

    if (selectedDealers.length > 0 && !selectedDealers.includes(dealerName))
      return false;

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(item.category)
    )
      return false;

    const price = Number(item.price || 0);

    if (priceRange === "under10k" && price >= 10000) return false;
    if (priceRange === "10kto25k" && (price < 10000 || price > 25000))
      return false;
    if (priceRange === "25kto50k" && (price <= 25000 || price >= 50000))
      return false;
    if (priceRange === "over50k" && price < 50000) return false;

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    const aPrice = Number(a.price || 0);
    const bPrice = Number(b.price || 0);
    const aYear = Number(a.year || 0);
    const bYear = Number(b.year || 0);
    const aMake = (a.make || "").toString();
    const bMake = (b.make || "").toString();

    switch (sortKey) {
      case "price-asc":
        return aPrice - bPrice;
      case "price-desc":
        return bPrice - aPrice;
      case "year-asc":
        return aYear - bYear;
      case "year-desc":
        return bYear - aYear;
      case "make-asc":
        return aMake.localeCompare(bMake);
      case "make-desc":
        return bMake.localeCompare(aMake);
      default:
        return (Number(b.id) || 0) - (Number(a.id) || 0);
    }
  });

  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1>
      <div className="marketplace-content">
        <aside className="marketplace-filters">
          <h3>Filters</h3>

          <div className="filter-group">
            <h4>Dealer</h4>
            {allDealers.map((dealer) => (
              <label key={dealer}>
                <input
                  type="checkbox"
                  value={dealer}
                  checked={selectedDealers.includes(dealer)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (e.target.checked)
                      setSelectedDealers((prev) => [...prev, value]);
                    else
                      setSelectedDealers((prev) =>
                        prev.filter((d) => d !== value),
                      );
                  }}
                />
                {dealer}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            {["powersports", "marine", "rv", "automotive"].map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (e.target.checked)
                      setSelectedCategories((prev) => [...prev, value]);
                    else
                      setSelectedCategories((prev) =>
                        prev.filter((c) => c !== value),
                      );
                  }}
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            {[
              ["", "All Prices"],
              ["under10k", "Under $10,000"],
              ["10kto25k", "$10,000 - $24,999"],
              ["25kto50k", "$25,000 - $50,000"],
              ["over50k", "Over $50,000"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="price"
                  value={value}
                  checked={priceRange === value}
                  onChange={() => setPriceRange(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </aside>

        <div className="marketplace-main">
          <div className="sort-controls">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="">None</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="year-asc">Year (Low to High)</option>
              <option value="year-desc">Year (High to Low)</option>
              <option value="make-asc">Make (A to Z)</option>
              <option value="make-desc">Make (Z to A)</option>
            </select>
          </div>

          <div className="marketplace-grid">
            {sortedListings.map((item) => (
              <Link
                to={`/marketplace/${item.id}`}
                key={item.id}
                className="marketplace-card"
              >
                <img
                  src={item.photos?.[0] || ""}
                  alt={item.model || "Listing"}
                />
                <div className="marketplace-info">
                  <h3>
                    {item.year} {item.make} {item.model}
                  </h3>
                  <p>
                    <strong>Price:</strong> $
                    {Number(item.price || 0).toLocaleString()}
                  </p>
                  <p>
                    <strong>Payment:</strong> $
                    {calculateBiWeekly(
                      Number(item.price || 0),
                      Number(item.interestRate || 0),
                      Number(item.term || 0),
                    )}{" "}
                    bi-weekly
                  </p>
                  <p id="terms">
                    Based on {item.term} months at {item.interestRate}% APR
                  </p>
                </div>
              </Link>
            ))}

            {sortedListings.length === 0 && (
              <p style={{ padding: "1rem" }}>No listings match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
