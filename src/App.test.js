import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

// Mock the main route bundle so the test focuses on app bootstrapping instead of page internals.
jest.mock("./routes/Routes.js", () => ({
  LoginPage: () => <div>login page</div>,
  SignupPage: () => <div>signup page</div>,
  ActivationPage: () => <div>activation page</div>,
  HomePage: () => <div>home page</div>,
  ProductsPage: () => <div>products page</div>,
  BestSellingPage: () => <div>best-selling page</div>,
  EventsPage: () => <div>events page</div>,
  FAQPage: () => <div>faq page</div>,
  CheckoutPage: () => <div>checkout page</div>,
  PaymentPage: () => <div>payment page</div>,
  OrderSuccessPage: () => <div>order success page</div>,
  ProductDetailsPage: () => <div>product details page</div>,
  ProfilePage: () => <div>profile page</div>,
  ShopCreatePage: () => <div>shop create page</div>,
  SellerActivationPage: () => <div>seller activation page</div>,
  ShopLoginPage: () => <div>shop login page</div>,
  OrderDetailsPage: () => <div>order details page</div>,
  TrackOrderPage: () => <div>track order page</div>,
  UserInbox: () => <div>user inbox page</div>,
  BidsPage: () => <div>bids page</div>,
  FlashSalePage: () => <div>flash sale page</div>,
  BidDetailsPage: () => <div>bid details page</div>,
  FlashSaleDetailsPage: () => <div>flash sale details page</div>,
}));

// Mock the shop route bundle for the same reason as the main route bundle above.
jest.mock("./routes/ShopRoutes", () => ({
  ShopDashboardPage: () => <div>shop dashboard page</div>,
  ShopCreateProduct: () => <div>shop create product</div>,
  ShopAllProducts: () => <div>shop all products</div>,
  ShopCreateEvents: () => <div>shop create events</div>,
  ShopCreateFlashSale: () => <div>shop create flash sale</div>,
  ShopAllEvents: () => <div>shop all events</div>,
  ShopAllCoupouns: () => <div>shop all coupons</div>,
  ShopPreviewPage: () => <div>shop preview page</div>,
  ShopAllOrders: () => <div>shop all orders</div>,
  ShopOrderDetails: () => <div>shop order details</div>,
  ShopAllRefunds: () => <div>shop all refunds</div>,
  ShopSettingsPage: () => <div>shop settings page</div>,
  ShopWithDrawMoneyPage: () => <div>shop withdraw money page</div>,
  ShopInboxPage: () => <div>shop inbox page</div>,
  ShopAllFlashSales: () => <div>shop all flash sales</div>,
  ShopCreateBid: () => <div>shop create bid</div>,
  ShopAllBids: () => <div>shop all bids</div>,
}));

// Mock the admin route bundle so the smoke test stays lightweight and deterministic.
jest.mock("./routes/AdminRoutes", () => ({
  AdminDashboardPage: () => <div>admin dashboard</div>,
  AdminDashboardUsers: () => <div>admin users</div>,
  AdminDashboardSellers: () => <div>admin sellers</div>,
  AdminDashboardOrders: () => <div>admin orders</div>,
  AdminDashboardProducts: () => <div>admin products</div>,
  AdminDashboardEvents: () => <div>admin events</div>,
  AdminDashboardWithdraw: () => <div>admin withdraw</div>,
}));

// Mock route guards so the test can render child content without store-specific auth setup.
jest.mock("./routes/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

// Mock the admin route guard with the same pass-through behavior used above.
jest.mock("./routes/ProtectedAdminRoute", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

// Mock the seller route guard with the same pass-through behavior used above.
jest.mock("./routes/SellerProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

// Mock the alternate shop home entry so the app can render it without loading the real module tree.
jest.mock("./ShopRoutes.js", () => ({
  ShopHomePage: () => <div>shop home page</div>,
}));

// Mock app-wide side-effect components that are not important for this bootstrap smoke test.
jest.mock("./components/preloader/Preloader", () => () => <div>preloader</div>);
jest.mock("./components/CookieConsent/CookieConsent", () => () => <div>cookie consent</div>);
jest.mock("./components/Login/LoginSuccessHandler", () => () => <div>login success handler</div>);
jest.mock("./components/Commission/CommissionDashboard", () => () => <div>commission dashboard</div>);

// Mock the legal pages because the test does not need their internal implementation details.
jest.mock("./pages/ForgotPasswordPage.js", () => () => <div>forgot password page</div>);
jest.mock("./pages/ResetPasswordPage.js", () => () => <div>reset password page</div>);
jest.mock("./pages/legal/TermsPage.js", () => () => <div>terms page</div>);
jest.mock("./pages/legal/CookiesPage.js", () => () => <div>cookies page</div>);
jest.mock("./pages/legal/ShippingPage.js", () => () => <div>shipping page</div>);
jest.mock("./pages/legal/ContactPage.js", () => () => <div>contact page</div>);
jest.mock("./pages/legal/LocationsPage.js", () => () => <div>locations page</div>);
jest.mock("./pages/legal/LiveChatPage.js", () => () => <div>live chat page</div>);
jest.mock("./pages/legal/CareerPage.js", () => () => <div>career page</div>);
jest.mock("./pages/legal/SellingPage.js", () => () => <div>selling page</div>);
jest.mock("./pages/legal/TransactionPage.js", () => () => <div>transaction page</div>);
jest.mock("./pages/legal/PrivacyPolicyPage.js", () => () => <div>privacy policy page</div>);
jest.mock("./pages/legal/BlogPage.js", () => () => <div>blog page</div>);
jest.mock("./pages/legal/AboutPage.js", () => () => <div>about page</div>);
jest.mock("./pages/legal/BlogDetailsPage.js", () => () => <div>blog details page</div>);

// Mock the referral provider as a simple pass-through so the app tree still matches the production structure.
jest.mock("./context/ReferralContext", () => ({
  ReferralProvider: ({ children }) => <>{children}</>,
}));

// Mock startup actions so dispatch can resolve immediately without hitting the network during the test.
jest.mock("./redux/actions/user", () => ({
  loadSeller: jest.fn(() => Promise.resolve()),
  loadUser: jest.fn(() => Promise.resolve()),
}));
jest.mock("./redux/actions/product", () => ({
  getAllProducts: jest.fn(() => Promise.resolve()),
}));
jest.mock("./redux/actions/event", () => ({
  getAllEvents: jest.fn(() => Promise.resolve()),
}));
jest.mock("./redux/actions/flashSale.js", () => ({
  getAllFlashSales: jest.fn(() => Promise.resolve()),
}));
jest.mock("./redux/actions/bids.js", () => ({
  getActiveBids: jest.fn(() => Promise.resolve()),
}));

// Mock the store so the bootstrap effect can dispatch startup actions without needing the real Redux store.
jest.mock("./redux/store", () => ({
  __esModule: true,
  default: {
    dispatch: jest.fn(() => Promise.resolve()),
  },
}));

describe("App bootstrap", () => {
  beforeEach(() => {
    // Use fake timers because the bootstrap flow intentionally delays hiding the preloader.
    jest.useFakeTimers();

    // Provide a safe analytics stub so the route tracking helper can run without crashing in the test environment.
    window.gtag = jest.fn();
  });

  afterEach(() => {
    // Restore real timers after each test so timer state does not leak between test cases.
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    delete window.gtag;
  });

  it("shows the preloader first and then renders the home page", async () => {
    render(<App />);

    // Confirm that the startup preloader is visible before the bootstrap work finishes.
    expect(screen.getByText("preloader")).toBeInTheDocument();

    // Fast-forward the startup delay so the app can finish bootstrapping.
    await act(async () => {
      jest.advanceTimersByTime(250);
    });

    // Confirm that the default home route is rendered after the bootstrap flow completes.
    expect(screen.getByText("home page")).toBeInTheDocument();
  });
});
