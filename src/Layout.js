import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Components/travel/Navbar';
import Footer from './Components/travel/Footer';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        
        :root {
          --color-primary: #c17f59;
          --color-secondary: #1a1a2e;
          --color-background: #faf9f7;
          --color-accent: #87a878;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: var(--color-background);
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--color-background);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a66b48;
        }
        
        /* Selection Color */
        ::selection {
          background: var(--color-primary);
          color: white;
        }
      `}</style>
      
      <Navbar />
      <main>{children || <Outlet />}</main>
      <Footer />
    </div>
  );
}