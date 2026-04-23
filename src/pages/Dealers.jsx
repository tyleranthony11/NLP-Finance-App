import { useNavigate } from "react-router-dom";
import "./Dealers.css";
import { useScrollReveal } from "../hooks/useScrollReveal";

const dealerLogos = [
  {
    src: "/images/dealers/blue-water-marine.avif",
    alt: "Blue Water Marine",
    name: "Blue Water Marine",
    location: "Mount Pearl",
  },
  {
    src: "/images/dealers/bruces-recreation.png",
    alt: "Bruce's Recreation",
    name: "Bruce's Recreation",
    location: "Clarenville",
  },
  {
    src: "/images/dealers/mf-motors.png",
    alt: "MF Motorsports",
    name: "MF Motorsports",
    location: "St. John's",
  },
  {
    src: "/images/dealers/mid-island-motorsports.png",
    alt: "Mid Island Motorsports",
    name: "Mid Island Motorsports",
    location: "Springdale",
  },
  {
    src: "/images/dealers/rugged-rock.png",
    alt: "Rugged Rock Harley-Davidson",
    name: "Rugged Rock Harley-Davidson",
    location: "Mount Pearl",
  },
  {
    src: "/images/dealers/arctic-west.png",
    alt: "Arctic West",
    name: "Arctic West",
    location: "Birchy Head",
  },
  {
    src: "/images/dealers/funnfast.png",
    alt: "Fun 'N' Fast",
    name: "Fun 'N' Fast",
    location: "Mount Pearl",
  },
  {
    src: "/images/dealers/merles-recreation.png",
    alt: "Merle's Parts & Recreation",
    name: "Merle's Parts & Recreation",
    location: "Clarenville",
  },
  {
    src: "/images/dealers/coastal-outdoors.png",
    alt: "Coastal Outdoors",
    name: "Coastal Outdoors",
    location: "Mount Pearl",
  },
  {
    src: "/images/dealers/pardys-recreation.png",
    alt: "Pardys Recreation & Marine",
    name: "Pardys Recreation & Marine",
    location: "Marystown",
  },
  {
    src: "/images/dealers/pa-sports.jpg",
    alt: "Pardy's Recreation & Marine",
    name: "P & A Sports",
    location: "Savage Cove",
  },
  {
    src: "/images/dealers/brp.png",
    alt: "The Outdoor Shoppe",
    name: "The Outdoor Shoppe",
    location: "St. Anthony",
  },
  {
    src: "/images/dealers/rapid-powersports2.jpg",
    alt: "Rapid Powersports",
    name: "Rapid Powersports",
    location: "Gander",
  },
  {
    src: "/images/dealers/bonne-bay.png",
    alt: "Bonne Bay Recreation",
    name: "Bonne Bay Recreation",
    location: "Bonne Bay",
  },
  {
    src: "/images/dealers/honda-one.png",
    alt: "Honda One",
    name: "Honda One",
    location: "Mount Pearl",
  },
  {
    src: "/images/dealers/four-sixty.png",
    alt: "Route 460 Powersports",
    name: "Route 460 Powersports",
    location: "Stephenville",
  },
];

function Dealers() {
  const navigate = useNavigate();
  useScrollReveal(".reveal");

  return (
    <div className="dealers-page">
      {/* Hero */}
      <section className="dealers-header">
        <div className="dealers-header-content reveal reveal-up">
          <p className="dealers-eyebrow">
            NLP Marketplace built for NL Dealers
          </p>
          <h1>Helping you Sell More Units - Without Giving Up Control.</h1>
          <p>
            We partner with Newfoundland & Labrador dealers to help you move
            inventory faster — while keeping you fully in control. No
            interference. No competing for your customers. Just more
            opportunities.
          </p>
        </div>
      </section>

      {/* Pitch */}
      <section className="dealers-pitch">
        <div className="dealers-pitch-inner">
          <h2 className="reveal reveal-up">Here's How It Works</h2>
          <p className="dealers-pitch-sub reveal reveal-up">
            Our dealer partnership is simple, transparent, and built to help you
            sell more units.
          </p>
          <div className="dealers-how-steps">
            <div
              className="dealers-how-step reveal reveal-up"
              style={{ transitionDelay: "0ms" }}
            >
              <span className="dealers-how-num">1</span>
              <strong>List Your Inventory</strong>
              <p>
                List your units on the NLP Marketplace and get your inventory in
                front of more buyers across Newfoundland & Labrador
              </p>
            </div>
            <div className="dealers-how-connector" />
            <div
              className="dealers-how-step reveal reveal-up"
              style={{ transitionDelay: "120ms" }}
            >
              <span className="dealers-how-num">2</span>
              <strong>You Own Every Lead</strong>
              <p>
                Every inquiry goes directly to your dealership. You control the
                customer, the conversation, and the deal — we never step in
                unless asked.
              </p>
            </div>
            <div className="dealers-how-connector" />
            <div
              className="dealers-how-step reveal reveal-up"
              style={{ transitionDelay: "240ms" }}
            >
              <span className="dealers-how-num">3</span>
              <strong>Financing — Only If You Want It</strong>
              <p>
                If a customer needs financing and you want our help, we step in.
                Otherwise, the sale is entirely yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnered Dealers */}
      <section className="dealer-logos">
        <h2 className="reveal reveal-up">Our Partnered Dealers</h2>
        <p className="dealer-logos-sub reveal reveal-up">
          Proud to work alongside some of NL's best.
        </p>
        <div className="dealer-logo-grid">
          {dealerLogos.map((dealer, i) => (
            <div
              className="dealer-logo-card reveal reveal-up"
              key={dealer.alt}
              style={{ transitionDelay: `${i * 60}ms` }}
              onClick={() =>
                navigate("/marketplace", { state: { dealer: dealer.name } })
              }
            >
              <img src={dealer.src} alt={dealer.alt} />
              <div className="dealer-logo-card-info">
                <strong>{dealer.name}</strong>
                <span>{dealer.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="dealer-testimonials">
        <h2 className="reveal reveal-up">What Dealers Are Saying</h2>
        <div className="testimonial-grid">
          {[
            {
              text: "I've had the privilege of working with Mark and Jackie many times over the past year with great success. They've assisted me in offering our customers a financing alternative that enabled them to buy the powersports unit they've always wanted. They provide top-notch service with efficiency and a smile.",
              footer: "Jeff Clarke — Manager, Mid Island Motorsports",
            },
            {
              text: "I have been dealing with NLP Finance for a number of years now. These people are truly friendly, professional and helpful and will make your experience a breeze!",
              footer: "Dennis Downey — Manager, Fun N Fast",
            },
            {
              text: "We have found NLP Finance to be a great addition to the financing options we can offer our customers. We can always rely on them for fast and efficient service to get our customers on the vehicle of their choice.",
              footer: "Owen Ball — Manager, Notre Dame Recreation",
            },
          ].map((t, i) => (
            <blockquote
              key={i}
              className="reveal reveal-up"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p>"{t.text}"</p>
              <footer>{t.footer}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dealers;
