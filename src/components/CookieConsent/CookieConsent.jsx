import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      // Show consent popup after a short delay
      setTimeout(() => {
        setShowConsent(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    // Set consent cookie for 1 year
    Cookies.set('cookieConsent', 'accepted', { 
      expires: 365,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
      path: '/'
    });
    
    // Also set third-party cookies consent
    Cookies.set('thirdPartyCookies', 'accepted', {
      expires: 365,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
      path: '/'
    });
    
    setShowConsent(false);
  };

  const handleReject = () => {
    // Set consent cookie as rejected
    Cookies.set('cookieConsent', 'rejected', { 
      expires: 365,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
      path: '/'
    });
    
    // Clear any existing cookies except essential ones
    const essentialCookies = ['cookieConsent'];
    document.cookie.split(';').forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      if (!essentialCookies.includes(cookieName)) {
        Cookies.remove(cookieName, { path: '/' });
      }
    });
    
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div 
      className="fixed left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4 bottom-[60px] md:bottom-0"
      style={{
        zIndex: 1001, // Higher than bottom nav's z-index of 1000
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full md:w-auto">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cookie Consent
          </h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, 
            personalize content, and analyze our traffic. By clicking "Accept All", 
            you consent to our use of cookies including third-party cookies for 
            authentication and analytics. You can manage your preferences or learn more 
            in our{' '}
            <Link 
              to="/cookie-policy" 
              className="text-[#29625d] hover:underline font-medium"
            >
              Cookie Policy
            </Link>
            {' '}and{' '}
            <Link 
              to="/privacy-policy" 
              className="text-[#29625d] hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end md:justify-start mt-3 md:mt-0">
          <button
            onClick={handleReject}
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-medium text-white bg-[#29625d] rounded-md hover:bg-[#1f4e45] transition-colors whitespace-nowrap"
          >
            Accept All
          </button>
          <button
            onClick={() => setShowConsent(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

