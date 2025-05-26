import React, { useState } from "react";
import { Link } from "react-router-dom";
import { calculateBiWeekly } from '../utils';
import dummyListings from "../data/dummyListings";
import "./Marketplace.css";

function Marketplace() {
  const [sortKey, setSortKey] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showDealers, setShowDealers] = useState(true);
  const [showPrivate, setShowPrivate] = useState(true);
  const [priceRange, setPriceRange] = useState("");


  const filteredListings = dummyListings.filter((item) => {
    if (item.dealership && !showDealers) return false;
    if (!item.dealership && !showPrivate) return false;

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(item.category)
    ) {
      return false;
    }

    if (priceRange === "under10k" && item.price >= 10000) return false;
    if (priceRange === "10kto25k" && (item.price < 10000 || item.price > 25000))
      return false;
    if (priceRange === "25kto50k" && (item.price <= 25000 || item.price >= 50000))
      return false;
    if (priceRange === "over50k" && item.price < 50000) return false;

    return true;
  });


  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortKey) {
        case 'price-asc':
            return a.price - b.price;
        case 'price-desc':
            return b.price - a.price;
        case 'year-asc':
            return a.year - b.year;
        case 'year-desc':
            return b.year - a.year;
        case 'make-asc':
            return a.make.localeCompare(b.make);
        case 'make-desc':
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
            <h4>Seller Type</h4>
            <label>
              <input
                type="checkbox"
                checked={showDealers}
                onChange={() => setShowDealers(!showDealers)}
              />
              Dealership
            </label>
            <label>
              <input
                type="checkbox"
                checked={showPrivate}
                onChange={() => setShowPrivate(!showPrivate)}
              />
              Private Seller
            </label>
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
            <label>
                <input
                    type="radio"
                    name="price"
                    value=""
                    checked={priceRange === ""}
                    onChange={() => setPriceRange("")}
                    />
                    All Prices
            </label>
            <label>
              <input
                type="radio"
                name="price"
                value="under10k"
                checked={priceRange === "under10k"}
                onChange={() => setPriceRange("under10k")}
              />
              Under $10,000
            </label>
            <label>
              <input
                type="radio"
                name="price"
                value="10kto25k"
                checked={priceRange === "10kto25k"}
                onChange={() => setPriceRange("10kto25k")}
              />
              $10,000 - $24,999
            </label>
            <label>
              <input
                type="radio"
                name="price"
                value="25kto50k"
                checked={priceRange === "25kto50k"}
                onChange={() => setPriceRange("25kto50k")}
              />
              $25,000 - $50,000
            </label>
            <label>
              <input
                type="radio"
                name="price"
                value="over50k"
                checked={priceRange === "over50k"}
                onChange={() => setPriceRange("over50k")}
              />
              Over $50,000
            </label>
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
                 <Link to={`/marketplace/${item.id}`} key={item.id} className="marketplace-card">
              <img src={item.photos[0]} alt={item.model} />
              <div className="marketplace-info">
                <h3>{item.year} {item.make} {item.model}</h3>
                <p><strong>Price:</strong> ${item.price.toLocaleString()}</p>
                <p><strong>Payment:</strong> ${calculateBiWeekly(item.price, item.rate, item.termMonths)} bi-weekly</p>
                <p id="terms">Based on {item.termMonths} months at {item.rate}% APR</p>
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
