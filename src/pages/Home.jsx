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
          <Link to="/finance" className="apply-button">Apply Now</Link>
        </div>
      </section>

      <section className="why-choose-us">
       <h2>Why Choose Us?</h2>
       <p>NLP Finance Inc. is Newfoundland & Labrador's only dedicated powersports financing broker, trusted since 2017 with decades of experince. We offer financing for new and used vehicles, for all credit types-good and bad. Wheather you're lookinbg for an ATV, side-by-side, motorcycle, travel trailer, RV or boat, we've got you covered!
       </p>
       <p>
        Our process is completly online, and we handle everything for you-making your financing experince seamless and stress-free.
       </p>
      </section>
    </div>
  );
}

export default Home;
