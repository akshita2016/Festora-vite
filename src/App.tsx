
import { Routes, Route, Navigate } from "react-router-dom";

import CitizenDash from "./pages/Citizen/CitizenDash";
import Home from "./pages/LandingHome";
import CitizenLayout from "./components/Layout/CitizenLayout";
import BusinessLayout from "./components/Layout/BusinessLayout";

import EventServices from "./pages/Citizen/EventServices";
import Favourites from "./pages/Citizen/Favourites";
import CitizenSetting from "./pages/Citizen/CitizenAadhaarForm";

import BusinessSetting from "./pages/Business/VendorRegistration";
//import BusinessDash from "./pages/Business/BusinessDash";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Citizen routes */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route path="dashboard" element={<CitizenDash />} />
        <Route path="venues" element={<EventServices />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="settings" element={<CitizenSetting />} />
      </Route>

      {/* Business routes */}
      <Route path="/business" element={<BusinessLayout />}>
        {/* <Route path="dashboard" element={<BusinessDash />} /> */}
        <Route path="settings" element={<BusinessSetting />} />
      </Route>

      {/* Common routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
