import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Landing } from "./pages/Landing";
import { Results } from "./pages/Results";
import { HowItWorks } from "./pages/HowItWorks";
import { AboutUs } from "./pages/AboutUs";
import { Contact } from "./pages/Contact";
import { Dashboard } from "./pages/Dashboard";
import { CarProfile } from "./pages/CarProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/car/:make/:model/:year" element={<CarProfile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
