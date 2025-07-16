import React, { useEffect, useState } from "react";

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  leadCard: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    marginBottom: "1rem",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  leadTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  leadInfo: {
    marginBottom: "0.25rem",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  confirmed: {
    backgroundColor: "#28a745",
  },
};

function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const storedLeads =
      JSON.parse(localStorage.getItem("financeFormDataList")) || [];
    setLeads(storedLeads.reverse());
  }, []);

  const handleConfirm = (index) => {
    const updatedLeads = [...leads];
    updatedLeads[index].confirmed = true;

    localStorage.setItem(
      "financeFormDataList",
      JSON.stringify([...updatedLeads].reverse())
    );
    setLeads(updatedLeads);
  };

  if (leads.length === 0) {
    return (
      <div style={styles.container}>
        <p>No leads submitted yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Leads</h1>
      {leads.map((lead, index) => (
        <div key={index} style={styles.leadCard}>
          <div style={styles.leadTitle}>{lead.fullName}</div>
          <div style={styles.leadInfo}>📧 {lead.email}</div>
          <div style={styles.leadInfo}>📞 {lead.phone}</div>
          <div style={styles.leadInfo}>📍 {lead.location}</div>
          <div style={styles.leadInfo}>🚗 Interested in: {lead.vehicle}</div>
          <div style={styles.leadInfo}>🏪 Seller: {lead.seller}</div>
          {lead.additionalInfo && (
            <div style={styles.leadInfo}>📝 {lead.additionalInfo}</div>
          )}
          {!lead.confirmed ? (
            <button style={styles.button} onClick={() => handleConfirm(index)}>
              Mark as Followed Up
            </button>
          ) : (
            <button style={{ ...styles.button, ...styles.confirmed }} disabled>
              ✅ Followed Up
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Leads;
