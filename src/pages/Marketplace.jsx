import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Pagination, Stack } from "@mui/material";
import { calculateBiWeekly } from "../utils";
import "./Marketplace.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { dealers } from "../data/dealers";

const PAGE_SIZE = 30;

function Marketplace() {
  const [sortKey, setSortKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [selectedDealers, setSelectedDealers] = useState([]);
  const [inventoryListings, setInventoryListings] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedOdoUnits] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    if (category) {
      setSelectedCategories([category]);
    }
  }, [location.search]);

  useEffect(() => {
    const dealerFromState = location.state?.dealer;
    if (dealerFromState) setSelectedDealers([dealerFromState]);
  }, [location.state]);

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

  const allConditions = ["new", "used"];

  const subcategoriesByCategory = useMemo(() => {
    const map = new Map();

    for (const item of inventoryListings) {
      const category = (item.category || "").trim();
      const subcat = (item.subcategory || "").trim();
      if (!category || !subcat) continue;

      if (!map.has(category)) map.set(category, new Set());
      map.get(category).add(subcat);
    }

    return map;
  }, [inventoryListings]);

  const availableSubcategories = useMemo(() => {
    if (selectedCategories.length === 0) return [];

    const set = new Set();
    for (const cat of selectedCategories) {
      const s = subcategoriesByCategory.get(cat);
      if (!s) continue;
      for (const sub of s) set.add(sub);
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [selectedCategories, subcategoriesByCategory]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      if (selectedSubcategories.length > 0) setSelectedSubcategories([]);
      return;
    }

    setSelectedSubcategories((prev) =>
      prev.filter((s) => availableSubcategories.includes(s)),
    );
  }, [selectedCategories, availableSubcategories]);

  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    sortKey,
    priceRange,
    selectedDealers,
    selectedCategories,
    selectedConditions,
    selectedSubcategories,
    selectedOdoUnits,
  ]);

  const filteredListings = inventoryListings.filter((item) => {
    const dealerName = item.dealership || "Private Seller";
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const listingName = [item.name, item.title, item.make, item.model]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (normalizedSearch && !listingName.includes(normalizedSearch)) {
      return false;
    }

    if (selectedDealers.length > 0 && !selectedDealers.includes(dealerName))
      return false;

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(item.category)
    )
      return false;

    if (
      selectedConditions.length > 0 &&
      !selectedConditions.includes((item.condition || "").toLowerCase())
    )
      return false;

    if (
      selectedSubcategories.length > 0 &&
      !selectedSubcategories.includes((item.subcategory || "").trim())
    )
      return false;

    if (
      selectedOdoUnits.length > 0 &&
      !selectedOdoUnits.includes(item.odometerUnit)
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

  const totalPages = Math.max(1, Math.ceil(sortedListings.length / PAGE_SIZE));

  const paginatedListings = sortedListings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="marketplace-page">
      <div className="marketplace-container">
        <h1>NLP Marketplace</h1>

        <div className="marketplace-content">
          <aside className="marketplace-filters">
            <div className="sort-controls marketplace-sort-panel">
              <label htmlFor="listing-search">Search:</label>
              <input
                id="listing-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a make, model, or year..."
              />
            </div>

            <div className="sort-controls marketplace-sort-panel">
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
            <div className="filters-panel">
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
                <h4>Condition</h4>
                {allConditions.map((c) => (
                  <label key={c}>
                    <input
                      type="checkbox"
                      value={c}
                      checked={selectedConditions.includes(c)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (e.target.checked)
                          setSelectedConditions((prev) => [...prev, value]);
                        else
                          setSelectedConditions((prev) =>
                            prev.filter((x) => x !== value),
                          );
                      }}
                    />
                    {c.charAt(0).toUpperCase() + c.slice(1)}
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

              {selectedCategories.length > 0 && (
                <div className="filter-group">
                  <h4>Subcategory</h4>

                  {availableSubcategories.length === 0 ? (
                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      No subcategories for selected category.
                    </p>
                  ) : (
                    availableSubcategories.map((subcat) => (
                      <label key={subcat}>
                        <input
                          type="checkbox"
                          value={subcat}
                          checked={selectedSubcategories.includes(subcat)}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (e.target.checked)
                              setSelectedSubcategories((prev) => [...prev, value]);
                            else
                              setSelectedSubcategories((prev) =>
                                prev.filter((s) => s !== value),
                              );
                          }}
                        />
                        {subcat}
                      </label>
                    ))
                  )}
                </div>
              )}

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
            </div>
          </aside>

          <div className="marketplace-main">
            <div className="marketplace-grid">
              {sortedListings.length === 0 ? (
                <p className="marketplace-empty-state">
                  No ads match your current search and filters.
                </p>
              ) : (
                paginatedListings.map((item) => {
                  const dealerName = (item.dealership || "").trim();
                  const dealer = dealers[dealerName];

                  return (
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

                        <p className="listing-price">
                          {Number(item.price) > 0 ? `$${Number(item.price).toLocaleString()}` : "Contact for Price"}
                        </p>

                        {Number(item.price) > 0 &&
                          Number(item.interestRate) > 0 &&
                          Number(item.term) > 0 && (
                            <>
                              <p className="listing-payment">
                                $
                                {calculateBiWeekly(
                                  Number(item.price || 0),
                                  Number(item.interestRate),
                                  Number(item.term),
                                )}{" "}
                                bi-weekly
                              </p>

                              <p className="listing-terms">
                                {item.term} months @ {item.interestRate}% APR
                              </p>
                              <p className="listing-disclaimer">
                                *Estimated payment. OAC, rate and terms may vary.
                              </p>
                            </>
                          )}
                      </div>

                      <div className="marketplace-card-footer">
                        <span className="dealer-name">
                          {item.dealership || "Private Seller"}
                        </span>

                        {dealer && (
                          <span className="dealer-location">
                            <LocationOnIcon sx={{ fontSize: 13 }} />
                            {dealer.location}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {sortedListings.length > 0 && totalPages > 1 && (
              <Stack
                className="marketplace-pagination"
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "10px",
                      fontWeight: 600,
                      color: "#354350",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      bgcolor: "#d71a20",
                      color: "#fff",
                      "&:hover": { bgcolor: "#b80016" },
                    },
                    "& .MuiPaginationItem-root:hover": {
                      bgcolor: "rgba(215, 26, 32, 0.12)",
                    },
                  }}
                />
              </Stack>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
