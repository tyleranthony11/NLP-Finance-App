import React from "react";
import "./About.css";

const teamMembers = [
    {
        name: "Mark Anthony",
        role: "Director",
        bio: "With 25 years of experience in retail financing, Director Mark Anthony is a seasoned veteran in his field. As a family man with a love of the outdoors, he is committed to helping fellow Newfoundlanders and Labradorians achieve their dreams of owning what they have always wanted so they too can experience the natural beauty of the island in their own way.",
        image: "/images/employees/mark.jpg"
    },
    {
        name: "Jackie Rendell",
        role: "Buisness Manager",
        bio: "Jackie spent 22 years in the world of banking before joining NLP Finance. As an expert in her field, she leads the charge in ensuring that we are always ready to help you achieve your ownership goals!",
        image: "/images/employees/jackie.jpg"
    }
];

function About() {
    return (
        <div className="about-page">
        <section className="about-hero">
                <img src="/images/nlpbuilding.jpg" alt="NLP Finance Building" />
            </section>
        <div className="about-container">
            
            <section className="company-info">
                <h1>About NLP Finance Inc.</h1>
                <p>
                    Founded in 2017 in Grand Falls-Windsor, NLP Finance is Newfoundland and Labrador’s dedicated powersports financing broker. We specialize in securing financing for new or used vehicles—whether you’re buying from a dealership or a private seller. We work with all credit types, from excellent credit to those who are rebuilding.
                </p>
                 <p>
                    Our mission is simple: make financing easy and stress-free. From your first application to the final signature, our team handles everything for you. The entire process can be completed over the phone, by email, or even by text—no need to step into an office.
                </p>
                 <p>
                 Once you complete a quick loan application, our team works hard to find you the best rate, term, and protection options. We also offer valuable insurance coverage such as Life, Accident & Health, or Critical Illness protection to safeguard your investment.
                </p>
                <p>
                 After securing conditional approval from a lender, we’ll guide you through the final steps, including submitting a few supporting documents. Once verification is complete, we’ll prepare your final paperwork and have the funds ready for your purchase.
                </p>
                <p>
                 We also offer flexible features like an attractive third-payment option, and you can pay off your loan at any time with no penalty.
                </p>
            </section>
            <section className="team-section">
                <h2>Meet Our Team</h2>
                <div className="team-grid">
                    {teamMembers.map((member, index) =>(
                        <div className="team-member" key={index}>
                            <img src={member.image} alt={member.name} />
                            <h3>{member.name}</h3>
                            <p className="role">{member.role}</p>
                            <p className="bio">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
        </div>
    );
}

export default About;