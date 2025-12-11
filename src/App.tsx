import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Landing } from "./pages/Landing";
import { Results } from "./pages/Results";
import { HowItWorks } from "./pages/HowItWorks";
import { AboutUs } from "./pages/AboutUs";
import { Contact } from "./pages/Contact";
import { Dashboard } from "./pages/Dashboard";
import { CarProfile } from "./pages/CarProfile";
import { ListingDetail } from "./pages/ListingDetail";
import { TryAutoMate } from "./pages/TryAutoMate";

/**
 * Root App component.
 * Layout wrapper (src/components/Layout.tsx) is available for pages to use.
 * Pages currently manage their own Navbar and gradient-bg to preserve existing behavior.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="antialiased text-text-primary">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/results" element={<Results />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/try" element={<TryAutoMate />} />
            <Route path="/car/:make/:model/:year" element={<CarProfile />} />
            <Route path="/car/:make/:model/:year/listing/:listingId" element={<ListingDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
