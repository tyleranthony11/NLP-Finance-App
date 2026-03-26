import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "./Finance.css";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function Finance() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          location: data.location,
          vehicle: data.vehicle,
          seller: data.seller,
          additionalInfo: data.additionalInfo || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Application submitted! We'll be in touch shortly.");
        reset();
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="finance-page">
      <section className="finance-hero">
        <div className="finance-hero-content">
          <h1>Apply for Financing</h1>
          <p>
            Start with our quick application below. It only takes a minute, and
            we’ll follow up with the next steps. Prefer to complete a full
            application now?{" "}
            <a
              href="https://v2.digital.dealertrack.ca/creditapp/standalone?token=51e9767a-c539-4874-a757-41df6d590bc2&flow=Full&lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="finance-hero-link"
            >
              Click here
            </a>
            .
          </p>
        </div>
      </section>

      <section className="finance-form-section">
        <form className="finance-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="finance-form-group">
            <label>First Name</label>
            <input
              type="text"
              {...register("firstName", { required: true })}
              className="finance-input"
            />
          </div>

          <div className="finance-form-group">
            <label>Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: true })}
              className="finance-input"
            />
          </div>

          <div className="finance-form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              {...register("email")}
              className="finance-input"
              required
            />
          </div>

          <div className="finance-form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              type="tel"
              {...register("phone")}
              className="finance-input"
              required
            />
          </div>

          <div className="finance-form-group">
            <label>Location (Town/City)</label>
            <input
              name="location"
              type="text"
              {...register("location")}
              className="finance-input"
              required
            />
          </div>

          <div className="finance-form-group">
            <label>
              What type of vehicle are you interested in?
            </label>
            <select
              name="vehicle"
              {...register("vehicle")}
              className="finance-input"
              required
            >
              <option value="">Select an option</option>
              <option value="powersports">Powersports</option>
              <option value="rv">RV / Travel Trailer</option>
              <option value="marine">Boat / Marine</option>
              <option value="automotive">Automotive</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="finance-form-group">
            <label>Dealership or Private Seller</label>
            <input
              name="seller"
              type="text"
              {...register("seller")}
              className="finance-input"
              required
            />
          </div>

          <div className="finance-form-group">
            <label>Additional Info (Optional)</label>
            <textarea
              name="additionalInfo"
              rows="4"
              placeholder="Tell us more about what you're looking for..."
              {...register("additionalInfo")}
              className="finance-input"
            ></textarea>
          </div>

          <button type="submit" className="finance-submit-btn">
            Submit Application
          </button>
        </form>
      </section>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Finance;
