import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <section className="home-section">
        <div className="home-content">
          <h1>Financing Made Simple</h1>
          <p>Get approved in minutes and drive away today.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
