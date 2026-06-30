import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import Listings from './pages/Listings';
import CityDetail from './pages/CityDetail';
import ListingDetail from './pages/ListingDetail';
import Booking from './pages/Booking';
import Schedule from './pages/Schedule';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminListingForm from './pages/AdminListingForm';
import Tickets from './pages/Tickets';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import ScrollToTop from './components/ScrollToTop';
import Checkout from './pages/Checkout';

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
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/listings" element={<Listings />} />
                  <Route path="/city/:id" element={<CityDetail />} />
                  <Route path="/listing/:id" element={<ListingDetail />} />
                  <Route path="/booking/:id" element={<Booking />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/listing/:id" element={<AdminListingForm />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/refund" element={<Refund />} />
                  <Route path="/checkout" element={<Checkout />} />
                </Routes>
              <Footer />
              <LiveChat />
              </div>
            </Router>
          </CurrencyProvider>
        </DataProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
