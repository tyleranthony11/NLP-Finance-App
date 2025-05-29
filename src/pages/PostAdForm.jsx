import React, { useState } from "react";
import "./PostAdForm.css";

function PostAdForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    make: "",
    model: "",
    kms: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send formData to backend
    console.log("Submitted Ad:", formData);
  };

  return (
    <div className="post-ad-form-container">
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

        <button type="submit" className="submit-button">Submit Ad</button>
      </form>
    </div>
  );
}

export default PostAdForm;
