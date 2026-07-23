import { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const LiveChat = lazy(() => import('./components/LiveChat'));
const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const CityDetail = lazy(() => import('./pages/CityDetail'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const Events = lazy(() => import('./pages/Events'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminListingForm = lazy(() => import('./pages/AdminListingForm'));
const AdminEvents = lazy(() => import('./pages/AdminEvents'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));

const pageFallback = (
  <div className="min-h-[40vh] flex items-center justify-center bg-[#0a0a1a] text-white">
    <div className="text-center">
      <div className="w-10 h-10 border-2 border-[#DB8293]/30 border-t-[#DB8293] rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm text-gray-300">Loading page...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <DataProvider>
          <CurrencyProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
                <Navbar />
                <Suspense fallback={pageFallback}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/city/:id" element={<CityDetail />} />
                    <Route path="/listing/:id" element={<ListingDetail />} />
                    <Route path="/booking/:id" element={<Booking />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/listing/:id" element={<AdminListingForm />} />
                    <Route path="/admin/events" element={<AdminEvents />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refund" element={<Refund />} />
                  </Routes>
                </Suspense>
                <Footer />
                <Suspense fallback={null}>
                  <LiveChat />
                </Suspense>
              </div>
            </Router>
          </CurrencyProvider>
        </DataProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
