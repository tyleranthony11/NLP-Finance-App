import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import "./Finance.css";

function Finance() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicleFormUrl = queryParams.get("vehicle") || "";
  const [vehicle, setVehicle] = useState("");

  useEffect(() => {
    if (vehicleFormUrl) {
      setVehicle(vehicleFormUrl);
    }
  }, [vehicleFormUrl]);



    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Send form data to back end
        alert("Application submitted! We'll be in touch shortly.")
    };

    return (
         <div className="finance-container">
      <section className="finance-section">
        <div className="finance-content">
          <h1>Apply for Financing</h1>
          <p>
            Start with our quick application below. It only takes a minute, and we’ll follow up with the next steps.
            Prefer to complete a full application now?{" "}
            <a
              href="https://v2.digital.dealertrack.ca/creditapp/standalone?token=51e9767a-c539-4874-a757-41df6d590bc2&flow=Full&lang=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>.
          </p>
        </div>
      </section>

      <section className="finance-form-section">
        <form className="finance-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" required />
          </div>
          <div className="form-group">
            <label>Location (Town/City)</label>
            <input type="text" required />
          </div>
          <div className="form-group">
            <label>What type of vehicle are you interested in?</label>
            <select required value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}>
              <option value="">Select an option</option>
              <option value="powersports">Powersports</option>
              <option value="rv">RV / Travel Trailer</option>
              <option value="marine">Boat / Marine</option>
              <option value="automotive">Automotive</option>
              <option value="other">Other</option>
            </select>
          </div>
             <div className="form-group">
            <label>Dealership or Private Seller</label>
            <input type="text" required />
          </div>
          <div className="form-group">
            <label>Additional Info (Optional)</label>
            <textarea
              rows="4"
              placeholder="Tell us more about what you're looking for..."
            ></textarea>
          </div>
          <button type="submit" className="apply-button">Submit Application</button>
        </form>
      </section>
    </div>
  );
}

export default Finance;