import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { FaPencilAlt, FaThLarge } from "react-icons/fa";
import "./Home.css";

function Home() {
  return (
    <Box className="home-container">
      <Box component="section" className="home-section">
        <Box className="home-content">
          <Typography component="h1">Financing Made Simple</Typography>
          <Typography component="p">
            Get approved in minutes and drive away today.
          </Typography>
          <Link to="/finance" className="apply-button">
            Apply Now
          </Link>
        </Box>
      </Box>
      <Box component="section" className="vehicle-banner">
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
        <Box className="marketplace-text" data-aos="fade-up">
          <Typography component="h2">
            Introducing the NLP Finance Marketplace
          </Typography>

          <Typography component="p">
            Looking to sell your vehicle? Whether it's a powersports unit, RV,
            boat or autombile - list it for free on our Marketplace and we can
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
        <Typography component="h2">Why Choose Us?</Typography>
        <Box className="why-point" data-aos="fade-left">
          <Box className="why-text">
            <Typography component="h3">
              Proudly Newfoundland & Labrador Owned and Operated
            </Typography>
            <Typography component="p">
              We're proud to be the only dedicated powersports finance broker
              based in Newfoundland & Labrador, trusted since 2017 with deep
              roots in our local dealers.
            </Typography>
          </Box>
          <Box className="why-icon">
            <img src="/images/nl.png" alt="NL Owned" />
          </Box>
        </Box>
        <Box className="why-point-reverse" data-aos="fade-right">
          <Box className="why-icon">
            <img src="/images/credit.png" alt="All Credit Types" />
          </Box>
          <Box className="why-text">
            <Typography component="h3">Financing for all Credit Types</Typography>
            <Typography component="p">
              Whether you have great credit, bad credit, or are rebuilding, we
              work with a range of lenders to help get you approved quickly and
              easily.
            </Typography>
          </Box>
        </Box>
        <Box className="why-point" data-aos="fade-left">
          <Box className="why-text">
            <Typography component="h3">
              New or Used, Dealer or Private Seller - We've Got You Covered
            </Typography>
            <Typography component="p">
              Wheather you're purchasing a brand-new ATV or a pre-owned Travel
              Trailer, from a dealership or a private seller, NLP Finance makes
              the process simple and stress-free with flexible financing options
              tailored to your needs.
            </Typography>
          </Box>
          <Box className="why-icon">
            <img src="/images/utv.png" alt="NL Owned" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
