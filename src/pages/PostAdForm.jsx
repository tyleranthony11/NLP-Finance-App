import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PostAdForm.css";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

const CURRENT_YEAR = new Date().getFullYear();

function PostAdForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    condition: "",
    title: "",
    year: "",
    make: "",
    model: "",
    odometerValue: "",
    odometerUnit: "km",
    price: "",
    description: "",
    photos: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPhotoCount = formData.photos?.length || 0;
  const photoLabel =
    selectedPhotoCount > 0
      ? `${selectedPhotoCount} file${selectedPhotoCount > 1 ? "s" : ""} selected`
      : "No file chosen";

  const MAX_PHOTOS = 10;

  const setError = (field, msg) =>
    setErrors((prev) => ({ ...prev, [field]: msg }));

  const clearError = (field) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  // ── Keyboard guard: block negatives, e/E, and cap digit count ──
  const blockNegativeAndLimit = (maxDigits) => (e) => {
    const control = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];
    if (control.includes(e.key)) return;
    if (["-", "e", "E", "+"].includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length >= maxDigits) e.preventDefault();
  };

  // ── Paste guard for numeric fields ──
  const handleNumericPaste = (maxDigits) => (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^\d]/g, "")
      .slice(0, maxDigits);
    const field = e.target.name;
    setFormData((prev) => ({ ...prev, [field]: pasted }));
    clearError(field);
  };

  // ── Paste guard for phone ──
  const handlePhonePaste = (e) => {
    e.preventDefault();
    const raw = e.clipboardData.getData("text").replace(/[^0-9+\-\s()]/g, "");
    const digits = raw.replace(/\D/g, "");
    if (digits.length > 11) {
      setError("phone", "Please enter a valid phone number.");
      return;
    }
    setFormData((prev) => ({ ...prev, phone: raw }));
    clearError("phone");
  };

  // ── Field change ──
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photos") {
      const selected = Array.from(files || []);
      if (selected.length > MAX_PHOTOS) {
        toast.error(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
        e.target.value = "";
        return;
      }
      const MAX_FILE_SIZE_MB = 5;
      const oversized = selected.filter(f => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
      if (oversized.length > 0) {
        toast.error(`Each photo must be under ${MAX_FILE_SIZE_MB}MB. Please compress or resize your images.`);
        e.target.value = "";
        return;
      }
      setFormData((prev) => ({ ...prev, photos: selected }));
      clearError("photos");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  // ── Blur validators (inline feedback) ──
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const v = value.trim();

    if (name === "name" && !v) {
      setError("name", "Please enter your full name.");
    } else if (name === "email") {
      const emailRe = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRe.test(v))
        setError("email", "Please enter a valid email address.");
    } else if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7)
        setError("phone", "Please enter a valid phone number.");
    } else if (name === "year" && v) {
      const y = Number(v);
      if (y < 1900 || y > CURRENT_YEAR + 1)
        setError(
          "year",
          `Please enter a valid year (1900–${CURRENT_YEAR + 1}).`,
        );
    } else if (name === "make" && !v) {
      setError("make", "Please enter the vehicle make.");
    } else if (name === "model" && !v) {
      setError("model", "Please enter the vehicle model.");
    } else if (name === "price") {
      if (!v || Number(v) <= 0)
        setError("price", "Please enter a valid selling price.");
    } else if (name === "description" && !v) {
      setError("description", "Please provide a description.");
    }
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Please enter your full name.";

    const emailRe = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRe.test(formData.email.trim()))
      newErrors.email = "Please enter a valid email address.";

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7)
      newErrors.phone = "Please enter a valid phone number.";

    const year = Number(formData.year);
    if (!formData.year || year < 1900 || year > CURRENT_YEAR + 1)
      newErrors.year = `Please enter a valid year (1900–${CURRENT_YEAR + 1}).`;

    if (!formData.make.trim())
      newErrors.make = "Please enter the vehicle make.";
    if (!formData.model.trim())
      newErrors.model = "Please enter the vehicle model.";

    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Please enter a valid selling price.";

    if (!formData.description.trim())
      newErrors.description = "Please provide a description.";

    if (!formData.photos || formData.photos.length === 0)
      newErrors.photos = "Please upload at least one photo.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const base64Photos = await Promise.all(
        formData.photos.map((photoFile) => fileToBase64(photoFile)),
      );

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        category: formData.category,
        year: Number(formData.year),
        make: formData.make.trim(),
        model: formData.model.trim(),
        title: formData.title.trim(),
        condition: formData.condition,
        odometerValue: formData.odometerValue
          ? Number(formData.odometerValue)
          : null,
        odometerUnit: formData.odometerValue ? formData.odometerUnit : null,
        price: formData.price ? Number(formData.price) : null,
        description: formData.description.trim(),
        photos: base64Photos,
      };

      const url = `${import.meta.env.VITE_API_URL}/api/marketplace`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      const raw = await res.text();

      let json = null;
      if (contentType.includes("application/json")) {
        try {
          json = JSON.parse(raw);
        } catch {
          /* invalid json */
        }
      }

      if (!res.ok) {
        toast.error(json?.message || `Request failed (${res.status})`);
        return;
      }
      if (json && json.success === false) {
        toast.error(json.message || "Failed to submit listing.");
        return;
      }

      toast.success("Your listing has been submitted for review!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        condition: "",
        title: "",
        year: "",
        make: "",
        model: "",
        odometerValue: "",
        odometerUnit: "km",
        price: "",
        description: "",
        photos: [],
      });
      setErrors({});
    } catch {
      toast.error("Failed to submit listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-ad-page">
      <section className="post-ad-hero">
        <div className="post-ad-hero-content">
          <img
            src="/images/dealers/nlp-finance-marketplace.png"
            alt="Marketplace Logo"
            className="post-ad-hero-logo"
          />
          <h1>List Your Vehicle for Sale</h1>
          <p>Fill out the form below to submit your unit to our marketplace.</p>
        </div>
      </section>

      <section className="post-ad-form-section">
        <form className="post-ad-form" onSubmit={handleSubmit}>
          <p className="post-ad-section-label">Seller Information</p>

          <div className="post-ad-form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              className={`post-ad-input${errors.name ? " input-error" : ""}`}
              required
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="post-ad-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className={`post-ad-input${errors.email ? " input-error" : ""}`}
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}

            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="post-ad-form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              className={`post-ad-input${errors.phone ? " input-error" : ""}`}
              required
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              inputMode="numeric"

              onKeyDown={(e) => {
                const isControl = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "ArrowLeft",
                  "ArrowRight",
                ].includes(e.key);
                const isDigit = /[0-9]/.test(e.key);
                const isAllowed = /[+\-\s()\\]/.test(e.key);
                const digitCount = (formData.phone.match(/\d/g) || []).length;
                if (!isControl && !isAllowed && !isDigit) {
                  e.preventDefault();
                  return;
                }
                if (isDigit && digitCount >= 11) e.preventDefault();
              }}
              onPaste={handlePhonePaste}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </div>

          <p className="post-ad-section-label">Vehicle Information</p>

          <div className="post-ad-form-group">
            <label>Category</label>
            <select
              name="category"
              className="post-ad-input"
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
          </div>

          <div className="post-ad-form-group">
            <label>Condition</label>
            <select
              name="condition"
              className="post-ad-input"
              required
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div className="post-ad-form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="post-ad-input"
              maxLength={150}
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="post-ad-form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              className={`post-ad-input${errors.year ? " input-error" : ""}`}
              required
              value={formData.year}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={blockNegativeAndLimit(4)}
              onPaste={handleNumericPaste(4)}
            />
            {errors.year && <span className="field-error">{errors.year}</span>}
          </div>

          <div className="post-ad-form-group">
            <label>Make</label>
            <input
              type="text"
              name="make"
              className={`post-ad-input${errors.make ? " input-error" : ""}`}
              required
              maxLength={100}
              value={formData.make}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.make && <span className="field-error">{errors.make}</span>}
          </div>

          <div className="post-ad-form-group">
            <label>Model</label>
            <input
              type="text"
              name="model"
              className={`post-ad-input${errors.model ? " input-error" : ""}`}
              required
              maxLength={100}
              value={formData.model}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.model && (
              <span className="field-error">{errors.model}</span>
            )}
          </div>

          <div className="post-ad-form-group">
            <label>Odometer</label>
            <div className="odometer-row">
              <input
                type="number"
                name="odometerValue"
                className="post-ad-input"
                step="1"
                value={formData.odometerValue}
                onChange={handleChange}
                onKeyDown={blockNegativeAndLimit(7)}
                onPaste={handleNumericPaste(7)}
              />
              <select
                name="odometerUnit"
                className="post-ad-input"
                value={formData.odometerUnit}
                onChange={handleChange}

              >
                <option value="km">Kilometers (km)</option>
                <option value="mi">Miles (mi)</option>
                <option value="hrs">Hours (hrs)</option>
              </select>
            </div>
          </div>

          <div className="post-ad-form-group">
            <label>Selling Price</label>
            <input
              type="number"
              name="price"
              className={`post-ad-input${errors.price ? " input-error" : ""}`}
              step="1"
              required
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={blockNegativeAndLimit(7)}
              onPaste={handleNumericPaste(7)}
            />
            {errors.price && (
              <span className="field-error">{errors.price}</span>
            )}
          </div>

          <div className="post-ad-form-group">
            <label>Description</label>
            <textarea
              name="description"
              className={`post-ad-input${errors.description ? " input-error" : ""}`}
              rows="5"
              required
              maxLength={2000}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe the condition, features, or any extra details..."
            />
            <span className="char-count">
              {formData.description.length} / 2000
            </span>
            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </div>

          <p className="post-ad-section-label">Photos</p>

          <div className="post-ad-form-group">
            <label>Upload Photos</label>
            <div className="custom-file-upload">
              <label htmlFor="photos-upload" className="file-upload-button">
                Choose Files
              </label>
              <span className="file-upload-text">{photoLabel}</span>
            </div>
            <input
              id="photos-upload"
              className="file-upload-input"
              type="file"
              name="photos"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
            {errors.photos && (
              <span className="field-error">{errors.photos}</span>
            )}
          </div>

          <button
            type="submit"
            className="post-ad-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Listing"}
          </button>
        </form>
      </section>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default PostAdForm;
