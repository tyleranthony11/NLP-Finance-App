import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  FaPencilAlt,
  FaThLarge,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHandshake,
} from "react-icons/fa";
import "./Home.css";
import { useScrollReveal } from "../hooks/useScrollReveal";

function Home() {
  useScrollReveal(".reveal");

  return (
    <Box className="home-container">
      <Box component="section" className="home-section">
        <Box className="home-content reveal reveal-up">
          <Typography component="p" className="hero-eyebrow">
            NLP Marketplace
          </Typography>
          <Typography component="h1">
            One Province.
            <br />
            One Marketplace.
          </Typography>
          <Typography component="p">
            All verified NL inventory. One trusted destination.
          </Typography>
          <Box className="hero-buttons">
            <Link to="/marketplace" className="hero-primary-btn">
              <FaThLarge className="button-icon" />
              Browse Marketplace
            </Link>
            <Link to="/PostAdForm" className="hero-secondary-btn">
              <FaPencilAlt className="button-icon" />
              Post an Ad
            </Link>
          </Box>
        </Box>
      </Box>

      <Box component="section" className="vehicle-banner reveal reveal-up">
        <Box className="vehicle-section text-banner">
          <Typography component="p">WHAT ARE YOU LOOKING FOR?</Typography>
        </Box>
        <Box className="vehicle-section image-banner">
          <Link to="/marketplace?category=powersports">
            <img src="/images/atvicon.png" alt="Powersports" />
            <Typography component="p">Powersports</Typography>
          </Link>
        </Box>
        <Box className="vehicle-section image-banner">
          <Link to="/marketplace?category=marine">
            <img src="/images/boaticon.png" alt="Marine" />
            <Typography component="p">Marine</Typography>
          </Link>
        </Box>
        <Box className="vehicle-section image-banner">
          <Link to="/marketplace?category=rv">
            <img src="/images/trailericon.png" alt="Travel Trailer" />
            <Typography component="p">Travel Trailer</Typography>
          </Link>
        </Box>
        <Box className="vehicle-section image-banner">
          <Link to="/marketplace?category=automotive">
            <img src="/images/truckicon.png" alt="Automotive" />
            <Typography component="p">Automotive</Typography>
          </Link>
        </Box>
      </Box>

      <Box component="section" className="marketplace-promo">
        <Box className="marketplace-text reveal reveal-up">
          <Typography component="h2">
            Introducing the NLP Finance Marketplace
          </Typography>
          <Typography component="p">
            Looking to sell your vehicle? Whether it's a powersports unit, RV,
            boat or automobile — list it for free on our Marketplace and we can
            offer financing to your buyer at no cost to you.
          </Typography>
          <Typography component="p">
            Browse a growing selection of both dealership and private-seller
            listings and get pre-approved for financing directly through us.
          </Typography>
          <Box className="marketplace-buttons">
            <Link to="/marketplace" className="browse-button">
              <FaThLarge className="button-icon" />
              Browse Marketplace
            </Link>
            <Link to="/PostAdForm" className="list-button">
              <FaPencilAlt className="button-icon" />
              Post an Ad
            </Link>
          </Box>
        </Box>
      </Box>

      <Box component="section" className="why-choose-us">
        <Typography component="h2" className="reveal reveal-up">
          Why Choose Us?
        </Typography>
        <Typography component="p" className="why-subtitle reveal reveal-up">
          Built for Newfoundlanders, by Newfoundlanders.
        </Typography>
        <Box className="why-cards">
          <Box
            className="why-card reveal reveal-up"
            style={{ transitionDelay: "0ms" }}
          >
            <Box className="why-card-icon">
              <FaMapMarkerAlt />
            </Box>
            <Typography component="h3">
              Proudly NL Owned &amp; Operated
            </Typography>
            <Typography component="p">
              The only dedicated powersports finance broker based in
              Newfoundland &amp; Labrador — trusted since 2017 with deep roots
              in our local dealers.
            </Typography>
          </Box>
          <Box
            className="why-card reveal reveal-up"
            style={{ transitionDelay: "120ms" }}
          >
            <Box className="why-card-icon">
              <FaCreditCard />
            </Box>
            <Typography component="h3">
              Financing for All Credit Types
            </Typography>
            <Typography component="p">
              Great credit, bad credit, or rebuilding — we work with a range of
              lenders to get you approved quickly and easily.
            </Typography>
          </Box>
          <Box
            className="why-card reveal reveal-up"
            style={{ transitionDelay: "240ms" }}
          >
            <Box className="why-card-icon">
              <FaHandshake />
            </Box>
            <Typography component="h3">Dealer or Private Seller</Typography>
            <Typography component="p">
              New or used, dealership or private sale — NLP Finance makes the
              process simple with flexible options tailored to your needs.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
