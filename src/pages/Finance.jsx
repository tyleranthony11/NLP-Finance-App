import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

const styles = {
  financeSection: {
    position: "relative",
    backgroundImage:
      "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('/images/traveltrailer.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
    padding: "2rem",
  },
  financeContent: {
    maxWidth: "800px",
  },
  financeContentH1: {
    fontSize: "3rem",
    margin: 0,
  },
  financeContentP: {
    fontSize: "1.25rem",
  },
  financeContentLink: {
    textDecoration: "none",
    color: "#d71a20",
  },
  financeFormSection: {
    backgroundColor: "#f9f9f9",
    padding: "4rem 2rem",
  },
  financeForm: {
    maxWidth: "600px",
    margin: "0.5rem auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    marginBottom: "0.5rem",
    fontWeight: 500,
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    fontFamily: "inherit",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#c00404",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

function Finance() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5001/api/leads/", {
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
    <div>
      <section style={styles.financeSection}>
        <div style={styles.financeContent}>
          <h1 style={styles.financeContentH1}>Apply for Financing</h1>
          <p style={styles.financeContentP}>
            Start with our quick application below. It only takes a minute, and
            we’ll follow up with the next steps. Prefer to complete a full
            application now?{" "}
            <a
              href="https://v2.digital.dealertrack.ca/creditapp/standalone?token=51e9767a-c539-4874-a757-41df6d590bc2&flow=Full&lang=en"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.financeContentLink}
            >
              Click here
            </a>
            .
          </p>
        </div>
      </section>

      <section style={styles.financeFormSection}>
        <form style={styles.financeForm} onSubmit={handleSubmit(onSubmit)}>
          <div style={styles.formGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              {...register("firstName", { required: true })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: true })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              {...register("email")}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              {...register("phone")}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location (Town/City)</label>
            <input
              name="location"
              type="text"
              {...register("location")}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              What type of vehicle are you interested in?
            </label>
            <select
              name="vehicle"
              {...register("vehicle")}
              style={styles.input}
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Dealership or Private Seller</label>
            <input
              name="seller"
              type="text"
              {...register("seller")}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Additional Info (Optional)</label>
            <textarea
              name="additionalInfo"
              rows="4"
              placeholder="Tell us more about what you're looking for..."
              {...register("additionalInfo")}
              style={styles.input}
            ></textarea>
          </div>

          <button type="submit" style={styles.button}>
            Submit Application
          </button>
        </form>
      </section>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Finance;
