import React, { useState } from "react";
import "./Marketplace.css";

const dummyListings = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        phone: "709-123-4567",
        dealership: false,
        category: "marine",
        make: "Seabreeze",
        model: "23ft Walkthru",
        year: 2022,
        price: 24000,
        description: "Low mileage, great condition",
        photos: ["/images/boat.png"],
        rate: 5.49,
        termMonths: 96,
    },
    {
        id: 2,
        name: "ABC Motors",
        email: "sales@abcmotors.com",
        address: "456 Dealership Ave",
        phone: "709-123-4567",
        dealership: true,
        category: "powersports",
        make: "Polaris",
        model: "RZR XP 1000",
        year: 2024,
        price: 15000,
        description: "Fully inspected. Good condition.",
        photos: ["/images/traveltrailer.png"],
        rate: 7.99,
        termMonths: 84,
    },
    {
        id: 2,
        name: "ABC Motors",
        email: "sales@abcmotors.com",
        address: "456 Dealership Ave",
        phone: "709-123-4567",
        dealership: true,
        category: "powersports",
        make: "Polaris",
        model: "RZR XP 1000",
        year: 2024,
        price: 15000,
        description: "Fully inspected. Good condition.",
        photos: ["/images/utv.png"],
        rate: 7.99,
        termMonths: 84,
    },
    {
        id: 3,
        name: "ABC Motors",
        email: "sales@abcmotors.com",
        address: "456 Dealership Ave",
        phone: "709-123-4567",
        dealership: true,
        category: "powersports",
        make: "Polaris",
        model: "RZR XP 1000",
        year: 2024,
        price: 15000,
        description: "Fully inspected. Good condition.",
        photos: ["/images/atv.png"],
        rate: 7.99,
        termMonths: 84,
    },
    {
        id: 4,
        name: "ABC Motors",
        email: "sales@abcmotors.com",
        address: "456 Dealership Ave",
        phone: "709-123-4567",
        dealership: true,
        category: "powersports",
        make: "Polaris",
        model: "RZR XP 1000",
        year: 2024,
        price: 15000,
        description: "Fully inspected. Good condition.",
        photos: ["/images/atv.png"],
        rate: 7.99,
        termMonths: 84,
    },
    {
        id: 5,
        name: "ABC Motors",
        email: "sales@abcmotors.com",
        address: "456 Dealership Ave",
        phone: "709-123-4567",
        dealership: true,
        category: "powersports",
        make: "Polaris",
        model: "RZR XP 1000",
        year: 2024,
        price: 15000,
        description: "Fully inspected. Good condition.",
        photos: ["/images/atv.png"],
        rate: 7.99,
        termMonths: 84,
    },

];

const calculateBiWeekly = (price, rate, termMonths) => {
    const decimalRate = rate / 100;
    const r = decimalRate / 26;
    const n = (termMonths / 12) * 26;

    const payment = (price * r * Math.pow(1 +r, n)) / (Math.pow(1 + r, n) - 1);

    return payment.toFixed(2); 
};

function Marketplace() {
    const [listings] = useState(dummyListings);


  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1>
      <div className="marketplace-grid">
        {listings.map((item) => (
          <div className="marketplace-card" key={item.id}>
            <img src={item.photos[0]} alt={item.model} />
            <div className="marketplace-info">
              <h3>{item.year} {item.make} {item.model}</h3>
              <p className="price"><strong>Price:</strong> ${item.price.toLocaleString()}</p>
              <p className="payment"><strong>Payment:</strong> ${calculateBiWeekly(item.price, item.rate, item.termMonths)} bi-weekly</p>
              <p className="terms">
                Based on {item.termMonths} months at {item.rate}% APR
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;