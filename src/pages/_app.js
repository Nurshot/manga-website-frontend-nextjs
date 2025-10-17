import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import '../styles/Homepage.css'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


function MyApp({ Component, pageProps }) {
    return (
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    );
  }


export default MyApp;