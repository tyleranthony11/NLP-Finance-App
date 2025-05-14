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
        <div className="why-point" data-aos="fade-left">
           
            <div className="why-text">
                <h3>Proudly Newfoundland & Labrador Owned and Operated</h3>
                <p>We're proud to be the only dedicated powersports finance broker based in Newfoundland & Labrador, trusted since 2017 with deep roots in our local dealers.</p>
            </div>
             <div className="why-icon">
                <img src="/images/nl.png" alt="NL Owned"/>
            </div>
        </div>
        <div className="why-point-reverse" data-aos="fade-right">
             <div className="why-icon">
                <img src="/images/credit.png" alt="All Credit Types"/>
            </div>
             <div className="why-text">
                <h3>Financing for all Credit Types</h3>
                <p>Whether you have great credit, bad credit, or are rebuilding, we work with a range of lenders to help get you approved quickly and easily.</p>
            </div>
        </div>
        <div className="why-point" data-aos="fade-left">
            <div className="why-text">
                <h3>New or Used, Dealer or Private Seller - We've Got You Covered</h3>
                <p>Wheather you're purchasing a brand-new ATV or a pre-owned Travel Trailer, from a dealership or a private seller, NLP Finance makes the process simple and stress-free with flexible financing options tailored to your needs.</p>
            </div>
             <div className="why-icon">
                <img src="/images/utv.png" alt="NL Owned"/>
            </div>
        </div>


      </section>
    </div>
  );
}

export default Home;
