import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadUser } from "./user";

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.response.data.message,
    });
  }
};

// get all orders of seller
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders/${shopId}`
    );

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response.data.message,
    });
  }
};

// get all orders of Admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "adminAllOrdersRequest",
    });

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
    });

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.response.data.message,
    });
  }
};

// Add action to handle won bid payment
export const createWonBidOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: "createWonBidOrderRequest" });

    // Get referral code from localStorage
    const referralCode = localStorage.getItem('referralCode');

    // Add referral code to order data
    const enrichedOrderData = {
      ...orderData,
      referralCode
    };

    const { data } = await axios.post(
      `${server}/order/create-won-bid-order`, 
      enrichedOrderData,
      { withCredentials: true }
    );

    // Clear referral code after successful order
    localStorage.removeItem('referralCode');

    dispatch({ type: "createWonBidOrderSuccess", payload: data.order });
  } catch (error) {
    dispatch({
      type: "createWonBidOrderFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// create order
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: "createOrderRequest" });

    // Get referral code from localStorage
    const globalReferralCode = localStorage.getItem('referralCode');
    
    // Get product-specific referral codes
    const referralProducts = JSON.parse(localStorage.getItem('referralProducts') || '{}');
    
    // Log referral information for debugging
    console.log("Creating order with referral data:", {
      globalReferralCode,
      referralProducts,
      cartItems: orderData.cart.length
    });
    
    // Enrich cart items with referral codes
    const enrichedCart = orderData.cart.map(item => {
      // Check if this product has a specific referral code
      if (referralProducts[item._id]) {
        console.log(`Applying product-specific referral code ${referralProducts[item._id]} to ${item._id}`);
        return { ...item, referralCode: referralProducts[item._id] };
      }
      // Otherwise use the global referral code if available
      else if (globalReferralCode) {
        console.log(`Applying global referral code ${globalReferralCode} to ${item._id}`);
        return { ...item, referralCode: globalReferralCode };
      }
      return item;
    });

    // Collect all unique referral codes from cart items
    const referralCodes = Array.from(new Set(
      enrichedCart
        .filter(item => item.referralCode)
        .map(item => item.referralCode)
    ));

    const enrichedOrderData = {
      ...orderData,
      cart: enrichedCart,
      // Include both singular (for backward compatibility) and array (for backend)
      referralCode: globalReferralCode,
      referralCodes: referralCodes
    };

    // Log the final order data being sent
    console.log("Sending order with referral data:", {
      orderReferralCode: enrichedOrderData.referralCode,
      referralCodes: enrichedOrderData.referralCodes,
      cartItemsWithReferrals: enrichedCart.filter(item => item.referralCode).length
    });

    const { data } = await axios.post(
      `${server}/order/create-order`, 
      enrichedOrderData,
      { withCredentials: true }
    );
    
    // Clear referral codes after successful order
    localStorage.removeItem('referralCode');
    localStorage.removeItem('referralProducts');
    
    dispatch({ type: "createOrderSuccess", payload: data.order });
    return data.order;
  } catch (error) {
    console.error("Order creation error:", error);
    dispatch({
      type: "createOrderFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Get commission dashboard
export const getCommissionDashboard = () => async (dispatch) => {
  try {
    dispatch({ type: "getCommissionDashboardRequest" });

    const { data } = await axios.get(`${server}/commission/dashboard`, {
      withCredentials: true,
    });

    dispatch({ 
      type: "getCommissionDashboardSuccess", 
      payload: {
        stats: data.stats,
        referralCode: data.referralCode
      }
    });
  } catch (error) {
    dispatch({
      type: "getCommissionDashboardFail",
      payload: error.response?.data?.message || "Failed to fetch commission data"
    });
  }
};

// Join commission program
export const joinCommissionProgram = () => async (dispatch) => {
  try {
    dispatch({ type: "joinCommissionProgramRequest" });

    const { data } = await axios.post(
      `${server}/commission/join`,
      {},
      { withCredentials: true }
    );

    dispatch({ 
      type: "joinCommissionProgramSuccess", 
      payload: {
        referralCode: data.commission.referralCode,
        balance: data.commission.balance
      }
    });

    toast.success(data.message || "Successfully joined the commission program!");
    dispatch(loadUser()); // Reload user to update isCommissioner status
  } catch (error) {
    dispatch({
      type: "joinCommissionProgramFail",
      payload: error.response?.data?.message || "Failed to join commission program"
    });
    toast.error(error.response?.data?.message || "Failed to join commission program");
  }
};

// Generate share link
export const generateShareLink = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "generateShareLinkRequest" });

    const { data } = await axios.post(
      `${server}/commission/generate-share-link`,
      { productId },
      { withCredentials: true }
    );

    dispatch({ 
      type: "generateShareLinkSuccess", 
      payload: data.shareLink 
    });

    return data.shareLink;
  } catch (error) {
    dispatch({
      type: "generateShareLinkFail",
      payload: error.response?.data?.message
    });
    throw error;
  }
};

// Track commission click
export const trackCommissionClick = (referralCode, visitId = null) => async (dispatch) => {
  try {
    if (!referralCode) {
      console.warn("No referral code provided for tracking");
      return null;
    }

    // Generate a unique visit ID if not provided
    const uniqueVisitId = visitId || `${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const response = await axios.post(
      `${server}/commission/track-click`,
      { 
        referralCode,
        visitId: uniqueVisitId // Send visit ID to backend for duplicate prevention
      },
      { withCredentials: true }
    );

    if (response.data.success) {
      console.log(`✅ Click tracked successfully for referral code: ${referralCode}`);
      return response.data;
    } else {
      console.warn("Click tracking returned unsuccessful:", response.data);
      return null;
    }
  } catch (error) {
    // Don't throw error - we don't want to break the user experience
    // Just log it for debugging
    console.error("Failed to track click:", error.response?.data?.message || error.message);
    // Return null to indicate failure without breaking the flow
    return null;
  }
};

