
import "./EventServices.css";
import React, { useState } from "react";
import axios from "axios";

// ─────────────────────────────────────────────
// Interfaces (clean schema)
// ─────────────────────────────────────────────
export interface Vendor {
  _id?: string;
  emailid: string;
  name: string;
  contact: string;
  business: string;
  area: string;
  address: string;
  city: string;
  estd: string;
  selcate: string;
  website?: string;
  insta?: string;
  shoppicurl?: string;
  certpicurl?: string;
  rating?: number;
  ratingCount?:number;
}

type Fav = {
  vendor: Vendor;
  isFavorite: boolean;
  onToggleFavorite: (vendor: Vendor) => void;
};
// ─────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronDown = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const MapPinIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={filled ? "#e8526e" : "none"}
    stroke={filled ? "#e8526e" : "currentColor"}
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─────────────────────────────────────────────
// Vendor Card (Presentation)
// ─────────────────────────────────────────────
export function VendorCard({ vendor, isFavorite, onToggleFavorite }: Fav) {

  
  return (
    <div className="es-card">
      {/* Image / placeholder */}
      <div className="es-card__img">
        {vendor.shoppicurl ? (
          <img src={vendor.shoppicurl} loading="lazy" alt={vendor.business} />
        ) : (
          <div className="es-card__img-placeholder">
            <BuildingIcon />
          </div>
        )}
      <button
  type="button"
  className="es-card__heart"
  onClick={() => onToggleFavorite(vendor)}
>
  <HeartIcon filled={isFavorite} />
</button>
            
      </div>

      <div className="es-card__body">
        {/* Business name */}
        <p className="es-card__biz">{vendor.business}</p>
        <p className="es-card__name">{vendor.name}</p>

      <div className="es-card__rating">
  <span>Rate this vendor:</span>

  {[1, 2, 3, 4, 5].map((star) => (
    <button
      type="button"
      key={star}
      onClick={() => alert(`You selected ${star} stars`)}
    >
      ⭐
    </button>
  ))}
</div>

        {/* Meta row */}
        <div className="es-card__meta">
          <span className="es-card__location">
            <MapPinIcon size={12} />
            {vendor.area}, {vendor.city}
          </span>
          {vendor.estd && (
            <span className="es-card__estd">Est. {vendor.estd}</span>
          )}
        </div>

        <hr className="es-card__divider" />

        {/* Links row */}
        <div className="es-card__links">
          <a href={`tel:${vendor.contact}`} className="es-card__link-btn">
            <PhoneIcon /> {vendor.contact}
          </a>
          {vendor.website && (
            <a href={vendor.website} target="_blank" rel="noreferrer" className="es-card__link-btn">
              <GlobeIcon /> Website
            </a>
          )}
        </div>

        <button type="button" className="es-card__view-btn">View Details →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty State (Presentation)
// ─────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="es-empty">
      <span className="es-empty__icon">{icon}</span>
      <p className="es-empty__title">{title}</p>
      <p className="es-empty__sub">{subtitle}</p>
    </div>
  );
}

const EVENT_OPTIONS = [
  "Birthday Party",
  "Anniversary Celebration",
  "Baby Shower",
  "Housewarming / Griha Pravesh",
  "Graduation Party",
  "Wedding",
  "Engagement Ceremony",
  "Mehendi Ceremony",
  "Haldi Ceremony",
  "Reception Party",
  "Corporate Event",
  "Farewell Party",
  "Festival Celebration",
  "Naming Ceremony",
  "Pool Party",
];

;

const SAMPLE_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
];

// ─────────────────────────────────────────────
// Main Presentation Component
// ─────────────────────────────────────────────
export default function Services (){


  const [filters, setFilters] = useState({
  event: "",
  Services: [] as string[],
  selectedServices: [] as string[],
  city: "",
});

const [vendors, setVendors] = useState<Vendor[]>([]);
const [cities, setCities] = useState<string[]>([]);

const [favorites, setFavorites] = useState<Vendor[]>([]);
const [showFavorites, setShowFavorites] = useState(false);



const citizenemail = localStorage.getItem("citizenemail") || "";
 //   Fetch services
const handleFetch = async (eventName: string) =>{
  try{
    const res = await axios.post(
 `${import.meta.env.VITE_API_URL}/service/fetch`,
  { event: eventName }
);

console.log("Services API response:", res.data);
setFilters((prev) => ({
  ...prev,
  Services: res.data.result.Services ?? [],
}));
  }
  catch(error)
  {
    console.error(error);
  }
}

const fetchCities = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/service/CityFetch`
    );

    if (res.data.status) {
      setCities(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

// service change

const handleServiceChange = (service: string) => {
  setFilters((prev) => ({
    ...prev,
    selectedServices: prev.selectedServices.includes(service)
      ? []
      : [service],
  }));
};

// find vendors


const handleFindVendors = async () => {
  if (!filters.city || filters.selectedServices.length === 0) {
    alert("Please select a city and service");
    return;
  }

  try {
    console.log("Selected city:", filters.city);
console.log("Selected services:", filters.selectedServices);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/service/VendorDetails`,
      {
        city: filters.city,
        services: filters.selectedServices,
      }
    );

    console.log("Vendor API response:", res.data);

    if (res.data.status) {
      setVendors(res.data.msg);
    } else {
      setVendors([]);
      alert(res.data.msg);
    }
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }
};



//toggle Favourites
const onToggleFavorite = async (vendor: Vendor) => {
  console.log(
  "Logged-in user:",
  JSON.parse(localStorage.getItem("user") || "{}").email
);

console.log("Selected vendor:", vendor.emailid);
   console.log("Heart clicked:", vendor.emailid);
  try {
    const token = localStorage.getItem("token");

    const saved = favorites.some(        // some() -> js method to check at least one element satisfy condition
      (item) => item.emailid === vendor.emailid
    );

    const url = saved
      ? `${import.meta.env.VITE_API_URL}/favorites/remove`
      : `${import.meta.env.VITE_API_URL}/favorites/add`;

    const res = await axios.post(
      url,
      {
        vendorEmail: vendor.emailid
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.data.status) {
      const updated = saved
        ? favorites.filter(
            (item) => item.emailid !== vendor.emailid
          )
        : [...favorites, vendor];

      setFavorites(updated);

      alert(saved
        ? "Removed from favorites!"
        : "Added to favorites! ❤️"
      );
    }
  } catch (error) {
    console.log(error);
    alert("Could not update favorites.");
  }
};

  return (
    <div className="es-page">
     

      {/* ══ LAYOUT ══ */}
      <div className="es-layout">
        {/* ── SIDEBAR / FILTER FORM ── */}
        <aside className="es-sidebar">
          <div className="es-sidebar__header">
            <p className="es-sidebar__heading">Find Business</p>
            <p className="es-sidebar__subheading">Select your event details below</p>
          </div>

          <form className="es-sidebar__form" noValidate>
            {/* Step 1 — Event */}
            <div className="es-field-group">
              <label className="es-field-label">
                <span className="es-step-badge">1</span>
                Select Event
              </label>
              <div className="es-select-wrap">
                <select className="es-select" defaultValue=""
                 value={filters.event}
  onChange={(e) =>
   { setFilters({
      ...filters,
      event: e.target.value,
      Services: [],
      selectedServices: [],
                  })
              handleFetch(e.target.value);     
  }}
             
                >
                  <option value="">— Choose an event —</option>
                  {EVENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="es-select-arrow"><ChevronDown /></span>
              </div>
            </div>

            {/* Step 2 — Services */}
            <div className="es-field-group">
              <label className="es-field-label">
                <span className="es-step-badge">2</span>
                Select Services
              </label>

              <div className="es-svc-actions">
                <button type="button" className="es-svc-action-btn">
                  <CheckIcon /> Select All
                </button>
                <button type="button" className="es-svc-action-btn muted">
                  Clear
                </button>
              </div>

              <div className="es-services-grid">
               {(filters.Services ?? []).map((service) => (
  <label key={service} className="es-svc-chip">
  <input
    type="checkbox"
    checked={filters.selectedServices.includes(service)}
    onChange={() => handleServiceChange(service)}
  />
  <span className="es-svc-checkbox" />
  <span className="es-svc-text">{service}</span>
</label>
))}
              </div>
            </div>

            {/* Step 3 — City */}
            <div className="es-field-group">
              <label className="es-field-label">
                <span className="es-step-badge">3</span>
                Select City
              </label>
              <div className="es-select-wrap">
                <span className="es-select-pin"><MapPinIcon /></span>
                <select className="es-select has-pin" defaultValue=""  value={filters.city}
   onFocus={() => {
    if (cities.length === 0) {
      fetchCities();
    }
  }}
  
  onChange={(e) =>
    setFilters({
      ...filters,
      city: e.target.value,
    })
  }>
                  <option value="">— Choose a city —</option>
                {cities.map((city) => (
  <option key={city} value={city}>
    {city}
  </option>
))}
                </select>
                <span className="es-select-arrow"><ChevronDown /></span>
              </div>
            </div>

            {/* Submit */}
            <button type="button" className="es-submit-btn"  onClick={handleFindVendors}>
              <SearchIcon /> Find Vendors
            </button>
          </form>
        </aside>

        {/* ── CONTENT ── */}
        <main className="es-content">
          {/* Page header */}
          <div className="es-content__header">
            <div>
              <h1 className="es-content__title">
                Explore <em>Event Business</em>
              </h1>
              <p className="es-content__subtitle">
                Fill in the form to discover vendors tailored to your event.
              </p>
            </div>
          </div>

          {/* Initial State */}
         
{vendors.length > 0 ? (
  <div className="es-vendors-grid">
 {vendors.map((vendor) => (
  <VendorCard
    key={vendor.emailid}
    vendor={vendor}
    isFavorite={favorites.some(
      (item) => item.emailid === vendor.emailid
    )}
    onToggleFavorite={onToggleFavorite}
  />
))}
  </div>
) : (
  <EmptyState
    icon="🎉"
    title="Ready to plan your event?"
    subtitle="Select your event type, services, and city — then hit Find Vendors!"
  />
)}

        </main>
      </div>
    </div>
  );
}
