import React from "react";
import { Link } from "react-router-dom";
import "./Dealers.css";
import { CheckCircle, Handshake, MapPin, FileText, Globe, Award } from "lucide-react";

function Dealers() {
  return (
    <div>
      <section className="dealers-header">
        <h1>Partner With NLP Finance</h1>
        <p>
          Helping powersports and RV dealers across Newfoudland & Labrador grow
          with fast, flexible financing solutions.
        </p>
        <p className="dealer-login-cta">
          Already a partnered dealer? <Link to="/dealer-login">Login here</Link>
        </p>
      </section>

      <section className="dealer-benefits">
        <h2>Why Partner With NLP Finance?</h2>
        <ul>
          <li><CheckCircle className="icon" /> We support all credit types — helping you close more deals</li>
          <li><Handshake className="icon" /> We work directly with your customers to keep things simple and smooth</li>
          <li><MapPin className="icon" /> All documentation is signed electronically — no printing, no delays</li>
          <li><FileText className="icon" /> 100% online process — fast, flexible, and hassle-free</li>
          <li><Globe className="icon" /> Proudly NL-owned and operated — committed to local dealers</li>
          <li><Award className="icon" /> Trusted since 2017 — built on integrity, service, and results</li>
        </ul>
      </section>

      <section className="dealer-testiomonials">
        <h2>What Other Dealers Are Saying</h2>
        <div className="testiomonial-grid">
          <blockquote>
            <p>
              "I’ve had the privilege of working with Mark and Jackie many times
              over the past year with great success. They’ve assisted me in
              offering our customers a financing alternative that enabled them
              to buy the powersports unit they’ve always wanted. They provide
              top-notch service with efficiency and a smile, helping us to serve
              our clients quickly and easily. We look forward to working with
              them in the future and highly recommend their services."
            </p>
            <footer>- Jeff Clarke, Manager, Mid Island Motorsports</footer>
          </blockquote>
          <blockquote>
            <p>
              "I have been dealing with NLP Finance for a number of years now as
              a lender for Fun 'n' Fast. These people are truly friendly,
              professional and helpful and will make your experience a breeze!"
            </p>
            <footer>- Dennis Downey, Manager, Fun N Fast</footer>
          </blockquote>
          <blockquote>
            <p>
              "We have found NLP Finance to be a great addition to the financing
              options that we can offer our customers who are looking to
              purchase that recreational vehicle of their dreams. We have found
              them to be very professional and we can always rely on them for
              fast and efficient service to get our customers on the vehicle of
              their choice."
            </p>
            <footer>- Owen Ball, Manager, Notre Dame Recreation</footer>
          </blockquote>
        </div>
      </section>

      <section className="dealer-logos">
        <h2>Some of Our Partnered Dealers</h2>
        <div className="logo-carousel">
          <img src="/images/dealers/mf-motors.png" />
          <img src="/images/dealers/rapid-powersports.gif" />
          <img src="/images/dealers/rugged-rock.png" />
          <img src="/images/dealers/vision.png" />
          <img src="/images/dealers/merles-recreation.png" />
          <img src="/images/dealers/mid-island-motorsports.png" />
          <img src="/images/dealers/four-sixty.png" />
          <img src="/images/dealers/arctic-west.png" />
          <img src="/images/dealers/normore-enterprises.png" />
          <img src="/images/dealers/coastal-outdoors.png" />
   
        </div>
      </section>

      <section className="lenders">
        <h2>Meet Some of Our Lenders</h2>
        <ul className="lender-list">
          <img src="/images/lenders/financeit.png" />
          <img src="/images/lenders/ia.png" />
          <img src="/images/lenders/quantech.png" />
        </ul>
      </section>
    </div>
  );
}

export default Dealers;
