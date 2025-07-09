import React, { useState } from "react";
import { Link } from "react-router-dom";
import { calculateBiWeekly } from "../utils";
import "./Marketplace.css";

function Marketplace() {
  const [sortKey, setSortKey] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [selectedDealers, setSelectedDealers] = useState([]);

  const [inventoryListings, setInventoryListings] = useState(() => {
    const saved = localStorage.getItem("listings");
    const activeListings = saved ? JSON.parse(saved) : [];
    console.log("Loaded inventory listings:", activeListings);
    return activeListings.filter((item) => item.status === "active");
  });

  const allDealers = Array.from(
    new Set(inventoryListings.map((item) => item.dealership))
  );

  const filteredListings = inventoryListings.filter((item) => {
    const dealerName = item.dealership || "Private Seller";

    if (selectedDealers.length > 0 && !selectedDealers.includes(dealerName)) {
      return false;
    }

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(item.category)
    ) {
      return false;
    }

    if (priceRange === "under10k" && item.price >= 10000) return false;
    if (priceRange === "10kto25k" && (item.price < 10000 || item.price > 25000))
      return false;
    if (
      priceRange === "25kto50k" &&
      (item.price <= 25000 || item.price >= 50000)
    )
      return false;
    if (priceRange === "over50k" && item.price < 50000) return false;

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortKey) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "year-asc":
        return a.year - b.year;
      case "year-desc":
        return b.year - a.year;
      case "make-asc":
        return a.make.localeCompare(b.make);
      case "make-desc":
        return b.make.localeCompare(a.make);
      default:
        return b.id - a.id;
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
                    if (e.target.checked) {
                      setSelectedDealers([...selectedDealers, value]);
                    } else {
                      setSelectedDealers(
                        selectedDealers.filter((d) => d !== value)
                      );
                    }
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
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, value]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== value)
                      );
                    }
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
                <img src={item.photos[0]} alt={item.model} />
                <div className="marketplace-info">
                  <h3>
                    {item.year} {item.make} {item.model}
                  </h3>
                  <p>
                    <strong>Price:</strong> ${item.price.toLocaleString()}
                  </p>
                  <p>
                    <strong>Payment:</strong> $
                    {calculateBiWeekly(
                      item.price,
                      item.interestRate,
                      item.term
                    )}{" "}
                    bi-weekly
                  </p>
                  <p id="terms">
                    Based on {item.term} months at {item.interestRate}% APR
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
