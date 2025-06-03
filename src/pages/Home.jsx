import React from "react";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaThLarge } from "react-icons/fa";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <section className="home-section">
        <div className="home-content">
          <h1>Financing Made Simple</h1>
          <p>Get approved in minutes and drive away today.</p>
          <Link to="/finance" className="apply-button">
            Apply Now
          </Link>
        </div>
      </section>
      <section className="vehicle-banner">
        <div className="vehicle-section text-banner">
          <p>FINANCING FOR EVERY LIFESTYLE</p>
        </div>
        <div className="vehicle-section image-banner">
          <Link to="/finance?vehicle=powersports">
          <img src="/images/atvicon.png" alt="Powersports" />
          <p>Powersports</p></Link>
        </div>
        <div className="vehicle-section image-banner">
          <Link to="/finance?vehicle=marine">
          <img src="/images/boaticon.png" alt="Marine" />
          <p>Marine</p></Link>
        </div>
        <div className="vehicle-section image-banner">
            <Link to="/finance?vehicle=rv">
          <img src="/images/trailericon.png" alt="Travel Trailer" />
          <p>Travel Trailer</p></Link>
        </div>
        <div className="vehicle-section image-banner">
          <Link to="/finance?vehicle=automotive">
          <img src="/images/truckicon.png" alt="Automotive" />
          <p>Automotive</p></Link>
        </div>
      </section>
      <section className="marketplace-promo">
        <div className="marketplace-text" data-aos="fade-up">
          <h2>Introducing the NLP Finance Marketplace</h2>
          
          <p>
            Looking to sell your vehicle? Whether it's a powersports unit, RV, boat or autombile - list it for free on our Marketplace and we can offer financing to your buyer at no cost to you.
          </p>
          <p>
            Browse a growing selection of both dealership and private-seller listings and get pre-approved for financing directly through us.
          </p>
          <div className="marketplace-buttons">
            <Link to="/marketplace" className="browse-button">
            <FaThLarge className="button-icon" />Browse Marketplace</Link>
            <Link to="/PostAdForm" className="list-button">
            <FaPencilAlt className="button-icon" />
            Post an Ad</Link>
          </div>
        </div>
      

      </section>

      <section className="why-choose-us">
        <h2>Why Choose Us?</h2>
        <div className="why-point" data-aos="fade-left">
          <div className="why-text">
            <h3>Proudly Newfoundland & Labrador Owned and Operated</h3>
            <p>
              We're proud to be the only dedicated powersports finance broker
              based in Newfoundland & Labrador, trusted since 2017 with deep
              roots in our local dealers.
            </p>
          </div>
          <div className="why-icon">
            <img src="/images/nl.png" alt="NL Owned" />
          </div>
        </div>
        <div className="why-point-reverse" data-aos="fade-right">
          <div className="why-icon">
            <img src="/images/credit.png" alt="All Credit Types" />
          </div>
          <div className="why-text">
            <h3>Financing for all Credit Types</h3>
            <p>
              Whether you have great credit, bad credit, or are rebuilding, we
              work with a range of lenders to help get you approved quickly and
              easily.
            </p>
          </div>
        </div>
        <div className="why-point" data-aos="fade-left">
          <div className="why-text">
            <h3>
              New or Used, Dealer or Private Seller - We've Got You Covered
            </h3>
            <p>
              Wheather you're purchasing a brand-new ATV or a pre-owned Travel
              Trailer, from a dealership or a private seller, NLP Finance makes
              the process simple and stress-free with flexible financing options
              tailored to your needs.
            </p>
          </div>
          <div className="why-icon">
            <img src="/images/utv.png" alt="NL Owned" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
