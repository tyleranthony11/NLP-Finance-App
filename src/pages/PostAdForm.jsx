import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./PostAdForm.css";
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

function PostAdForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    year: "",
    make: "",
    model: "",
    kms: "",
    price: "",
    description: "",
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos") {
      setFormData({ ...formData, photos: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const base64Photos = await Promise.all(
      formData.photos.map((photoFile) => fileToBase64(photoFile))
    );

    const listingData = {
      ...formData,
      photos: base64Photos,
      status: "pending",
      id: Date.now(),
    };

    const listings = JSON.parse(localStorage.getItem("listings")) || [];
    listings.push(listingData);
    localStorage.setItem("listings", JSON.stringify(listings));

    toast.success("Your listing has been submitted for review!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "",
      year: "",
      make: "",
      model: "",
      kms: "",
      price: "",
      description: "",
      photos: [],
    });
  };

  return (
    <div className="post-ad-form-container">
      <img
        src="/images/dealers/nlp-finance-marketplace.png"
        alt="Marketplace Logo"
        className="marketplace-logo"
      />
      <h2>List Your Vehicle for Sale</h2>
      <p>Fill out the form below to submit your unit to our marketplace.</p>
      <form onSubmit={handleSubmit} className="post-ad-form">
        <fieldset>
          <legend>Seller Information</legend>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <legend>Vehicle Information</legend>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a Category</option>
            <option value="powersports">Powersports</option>
            <option value="marine">Marine</option>
            <option value="rv">RV / Travel Trailer</option>
            <option value="automotive">Automotive</option>
          </select>
          <input
            type="number"
            name="year"
            placeholder="Year"
            required
            value={formData.year}
            onChange={handleChange}
          />
          <input
            type="text"
            name="make"
            placeholder="Make"
            required
            value={formData.make}
            onChange={handleChange}
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            required
            value={formData.model}
            onChange={handleChange}
          />
          <input
            type="number"
            name="kms"
            placeholder="Kilometers (optional)"
            value={formData.kms}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Selling Price"
            value={formData.price}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Describe the condition, features, or any extra details..."
            rows="5"
            required
            value={formData.description}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <legend>Upload Photos</legend>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleChange}
          />
        </fieldset>

        <button type="submit" className="submit-button">
          Submit Ad
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default PostAdForm;
