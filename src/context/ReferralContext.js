import React, { createContext, useContext, useState, useEffect } from 'react';

const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  // Initialize from localStorage if available
  const [referralProducts, setReferralProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('referralProducts');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure it's an object before converting to Map
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return new Map(Object.entries(parsed));
        }
      }
    } catch (error) {
      console.error('Error loading referral products from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('referralProducts');
    }
    return new Map();
  });
  
  // Save to localStorage whenever referralProducts changes
  useEffect(() => {
    try {
      if (referralProducts.size > 0) {
        const referralObj = Object.fromEntries(referralProducts);
        localStorage.setItem('referralProducts', JSON.stringify(referralObj));
      } else {
        // Clear if empty
        localStorage.removeItem('referralProducts');
      }
    } catch (error) {
      console.error('Error saving referral products to localStorage:', error);
    }
  }, [referralProducts]);
  
  const addReferralProduct = (productId, referralCode) => {
    if (!productId || !referralCode) {
      console.warn('Invalid referral data:', { productId, referralCode });
      return;
    }
    
    setReferralProducts(prev => {
      const newMap = new Map(prev);
      newMap.set(productId, referralCode);
      return newMap;
    });
    
    // Also sync with localStorage immediately for redundancy
    try {
      const referralObj = JSON.parse(localStorage.getItem('referralProducts') || '{}');
      referralObj[productId] = referralCode;
      localStorage.setItem('referralProducts', JSON.stringify(referralObj));
    } catch (error) {
      console.error('Error syncing referral to localStorage:', error);
    }
    
    // Also log this action for debugging
    console.log(`Added referral for product ${productId} with code ${referralCode}`);
  };

  const getReferralCode = (productId) => {
    return referralProducts.get(productId);
  };

  const clearReferralProduct = (productId) => {
    setReferralProducts(prev => {
      const newMap = new Map(prev);
      newMap.delete(productId);
      return newMap;
    });
  };

  const clearAllReferrals = () => {
    setReferralProducts(new Map());
    try {
      localStorage.removeItem('referralProducts');
    } catch (error) {
      console.error('Error clearing referral products:', error);
    }
  };
  
  // Get all referral codes as an array (for backend compatibility)
  const getAllReferralCodes = () => {
    return Array.from(new Set(referralProducts.values()));
  };

  return (
    <ReferralContext.Provider value={{
      referralProducts,
      addReferralProduct,
      getReferralCode,
      clearReferralProduct,
      clearAllReferrals,
      getAllReferralCodes
    }}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => useContext(ReferralContext); 