import React from 'react';
import TopNav from '../components/TopNav';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ClientLayout = ({ children }) => {
    return (
        <>
            <TopNav />
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
        </>
    );
};

export default ClientLayout;