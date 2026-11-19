
import "./VendorRegistration.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface VendorData {
  emailid: string;
  name: string;
  contact: string;
  business: string;
  area: string;
  address: string;
  city: string;
  estd: string;
  selcate: string[];
  website: string;
  insta: string;
  shoppicurl: File | null;
  certpicurl: File | null;
}


const CATEGORY_OPTIONS = [
  { label: "Decoration", value: "Decoration" },
  { label: "Photography", value: "Photography" },
  { label: "Videography", value: "Videography" },
  { label: "Catering", value: "Catering" },
  { label: "Venue / Banquet Hall", value: "Venue / Banquet Hall" },
  { label: "Tent & Seating", value: "Tent & Seating" },
  { label: "Stage Setup", value: "Stage Setup" },
  { label: "Lighting", value: "Lighting" },
  { label: "Sound System", value: "Sound System" },
  { label: "Music & DJ", value: "Music & DJ" },
  { label: "Artists & Performers", value: "Artists & Performers" },
  { label: "Makeup Artists", value: "Makeup Artists" },
  { label: "Mehendi Artists", value: "Mehendi Artists" },
  { label: "Priest / Pandit", value: "Priest / Pandit" },
  { label: "Devotional Singers", value: "Devotional Singers" },
  { label: "Wedding / Event Planner", value: "Wedding / EventPlanner" },
  { label: "Floral Decoration", value: "Floral Decoration" },
  { label: "Cake & Bakery", value: "Cake & Bakery" },
  { label: "Invitation Cards", value: "Invitation Cards" },
  { label: "Return Gifts & Party Favors", value: "Return Gifts & Party Favors" },
  { label: "Host / Anchor / Emcee", value: "Host / Anchor / Emcee" },
  { label: "Transportation", value: "Transportation" },
  { label: "Security Services", value: "Security Services" },
  { label: "Cleaning Services", value: "Cleaning Services" },
  { label: "Projector & Presentation Equipment", value: "Projector & Presentation Equipment" },
  { label: "LED Wall / Display Screen", value: "LED Wall / Display Screen" },
  { label: "Conference Audio Equipment", value: "Conference Audio Equipment " },
  { label: "Registration Desk & Check-in", value: "Registration Desk & Check-in" },
  { label: "Exhibition Booth Setup", value: "Exhibition Booth Setup" },
  { label: "Branding & Backdrops", value: "Branding & Backdrops" },
  { label: "Corporate Gifts", value: "Corporate Gifts" },
  { label: "Live Streaming", value: "Live Streaming" },
  { label: "Internet / Wi-Fi Setup", value: "Internet / Wi-Fi Setup" },
];



const VendorRegistration: React.FC = () => {

  const [formData, setFormData] = useState(
    {
      emailid: "",
      name: "",
      contact: "",
      business: "",
      area: "",
      address: "",
      city: "",
      estd: "",
      selcate: [],
      website: "",
      insta: "",
      shoppicurl: null,
      certpicurl: null,
    }
  );

  const [shopPhoto, setShopPhoto] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [shopPreview, setShopPreview] = useState<string | null>(null);
  const [certPreview, setCertPreview] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const shopRef = useRef<HTMLInputElement>(null);
  const certRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const lookupEmailRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      
      if (!formData.emailid || !formData.name || !formData.contact || !formData.business) {
        alert("Please fill all the fields");
        return;
      }
      console.log(formData);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
  if (key !== "shoppicurl" && key !== "certpicurl") {
    data.append(
      key,
      key === "selcate" ? JSON.stringify(value) : String(value ?? "")
    );
  }
});

      if (shopPhoto) {
  data.append("shoppicurl", shopPhoto);
}

if (certificate) {
  data.append("certpicurl", certificate);
}


// console.log("Shop file:", shopPhoto);
// console.log("Certificate file:", certificate);

// console.log("Shop file type:", shopPhoto?.type);
// console.log("Certificate file type:", certificate?.type);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/vendor/register`, data);
      console.log(response.data);

      alert("Business Registered successfully");
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleFetch = async () => {
    const email = lookupEmailRef.current?.value.trim();
    if (!email) {
      alert("Enter an email address to look");
      return;
    }

    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendor/fetch`,
        {
          params: {
             emailid: email.toLowerCase()
          }
        }
      );
      const vendor = result.data.vendor;
      setFormData({ ...formData, ...vendor });
    
      alert("Business details fetched successfully");
    } catch (error) {
      alert("No business registered with this email");
    }
  };


  const handleUpdate = async () => {
  if (!formData.emailid.trim()) {
    alert("Fill details");
    return;
  }

  try {
    const data = new FormData();
  console.log(formData.selcate);

   Object.entries(formData).forEach(([key, value]) => {
  if (key === "shoppicurl" || key === "certpicurl") return;

 if (key === "selcate") {
 data.append(key, JSON.stringify(formData.selcate));
}else {
    data.append(key, String(value ?? ""));
  }
});

    if (shopPhoto) {
      data.append("shoppicurl", shopPhoto);
    }

    if (certificate) {
      data.append("certpicurl", certificate);
    }

    const result = await axios.put(
      `${import.meta.env.VITE_API_URL}/vendor/update`,
      data
    );

    console.log(result.data);

    const vendor = result.data.vendor;

    setFormData(prev => ({
      ...prev,
      ...vendor 
    }));

    alert("Business details updated successfully");
  } catch (error) {
    console.error(error);
    alert("Update failed");
  }
};


  const removeImg = (f: "shoppicurl" | "certpicurl", ref: React.RefObject<HTMLInputElement | null>) => {
    if (f === "shoppicurl") {
      setShopPreview(null);
      setShopPhoto(null);
    } else {
      setCertPreview(null);
      setCertificate(null);
    }

    setFormData((p) => ({ ...p, [f]: "" }));
    if (ref.current) ref.current.value = "";
  };


  const loadImage = (e: React.ChangeEvent<HTMLInputElement>, f: "shoppicurl" | "certpicurl", set: (v: string | null) => void, setFile: (v: File | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      set(reader.result as string);
      setFormData((p) => ({ ...p, [f]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="vr-page">
      {/* Top bar */}
      <header className="vr-topbar">
        <div className="vr-topbar__brand">
          <div className="vr-topbar__logo">V</div>
          <span>BusinessHub</span>
        </div>

        <div className="vr-topbar__lookup">
          <input
          ref={lookupEmailRef}
            className="vr-lookup-input"
            type="email"
            placeholder="Load Business by email…"

            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          />
          <button className="vr-btn vr-btn--ghost vr-btn--sm" onClick={handleFetch}>
            Look up
          </button>
        </div>

        <div className="vr-topbar__actions">
          <button className="vr-btn vr-btn--outline vr-btn--sm" onClick={handleUpdate}>
            Update Record
          </button>
          <button className="vr-btn vr-btn--primary vr-btn--sm" onClick={handleSave} >
            Save &amp; Register
          </button>
        </div>
      </header>

      <div className="vr-layout">
        {/* ── Sidebar ── */}
        <aside className="vr-sidebar">
          {/* Avatar card */}
          <div className="vr-profile-card">
            <div className="vr-avatar">
              <span className="vr-avatar__initials">?</span>
              <div className="vr-avatar__score">0%</div>
            </div>
            <p className="vr-profile-name">Business Name</p>

            <div className="vr-progress">
              <div className="vr-progress__fill" style={{ width: "0%" }} />
            </div>
            <p className="vr-progress__label">Profile 0% complete</p>
          </div>

          {/* Nav */}

        </aside>

        {/* ── Form ── */}
        <main className="vr-form">
          {/* ── BASIC INFORMATION ── */}
          <section id="basic" className="vr-section">
            <div className="vr-section__head">
              <span className="vr-section__num">01</span>
              <div>
                <h2 className="vr-section__title">Basic Information</h2>
                <p className="vr-section__sub">Primary contact details for this Business account</p>
              </div>
            </div>

            <div className="vr-fields">
              <div className="vr-field vr-field--full">
                <label className="vr-label">Email Address <span className="vr-req">*</span></label>
                <input
                  className="vr-input"
                  type="email"
                  placeholder="Business@company.com"
                  required
                  value={formData.emailid}
                  onChange={(e) => setFormData({ ...formData, emailid: e.target.value })}
                />
              </div>

              <div className="vr-field">
                <label className="vr-label">Full Name <span className="vr-req">*</span></label>
                <input
                  className="vr-input"
                  placeholder="e.g. Riya Sharma"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="vr-field">
                <label className="vr-label">Contact Number</label>
                <input
                  className="vr-input"
                  placeholder="+91 98765 43210"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* ── BUSINESS DETAILS ── */}
          <section id="business" className="vr-section">
            <div className="vr-section__head">
              <span className="vr-section__num">02</span>
              <div>
                <h2 className="vr-section__title">Business Details</h2>
                <p className="vr-section__sub">Information about your business entity and location</p>
              </div>
            </div>

            <div className="vr-fields">
              <div className="vr-field">
                <label className="vr-label">Business Name</label>
                <input className="vr-input" placeholder="Registered business name"
                  value={formData.business}
                  onChange={(e) => setFormData({ ...formData, business: e.target.value })}

                />
              </div>

              <div className="vr-field">
                <label className="vr-label">Established In</label>
                <input
                  className="vr-input"
                  type="number"
                  placeholder="e.g. 2015"
                  min="1900"
                  value={formData.estd}
                  onChange={(e) => setFormData({ ...formData, estd: e.target.value })}
                />
              </div>

              <div className="vr-field">
                <label className="vr-label">City</label>
                <input className="vr-input" placeholder="City" value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>

              <div className="vr-field">
                <label className="vr-label">Area / Locality</label>
                <input className="vr-input" placeholder="Neighbourhood or locality" value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
              </div>

              <div className="vr-field vr-field--full">
                <label className="vr-label">Full Address</label>
                <input className="vr-input" placeholder="Street, landmark, pin code…" value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </div>
          </section>

          {/* ── SERVICE CATEGORIES ── */}
          <section id="categories" className="vr-section">
            <div className="vr-section__head">
              <span className="vr-section__num">03</span>
              <div>
                <h2 className="vr-section__title">Service Categories</h2>
                <p className="vr-section__sub">Select all services this Business provides</p>
              </div>
            </div>

            <div className="vr-category-select">
              <button
                type="button"
                className="vr-category-select__trigger"
                onClick={() => setShowCategories(!showCategories)}
                aria-expanded={showCategories}
              >
                <span>Select</span>
                <span className="vr-category-select__arrow">⌃</span>
              </button>

              <div className="vr-category-select__menu" style={{ display: showCategories ? "block" : "none" }}>
                {CATEGORY_OPTIONS.map(({ label, value }) => (
                  <label key={value} className="vr-category-select__option">
                  <input
  type="checkbox"
  checked={formData.selcate.includes(value)}
  onChange={(e) =>
    setFormData({
      ...formData,
      selcate: e.target.checked
        ? [...formData.selcate, value]
        : formData.selcate.filter((item) => item !== value)
    })
  }
/>
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ── ONLINE PRESENCE ── */}
          <section id="presence" className="vr-section">
            <div className="vr-section__head">
              <span className="vr-section__num">04</span>
              <div>
                <h2 className="vr-section__title">Online Presence</h2>
                <p className="vr-section__sub">Links help clients discover and verify your business</p>
              </div>
            </div>

            <div className="vr-fields">
              <div className="vr-field">
                <label className="vr-label">Website URL</label>
                <div className="vr-input-group">
                  <span className="vr-input-group__pre">🌐</span>
                  <input className="vr-input vr-input--grouped" placeholder="https://yourwebsite.com" value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>
              </div>
              <div className="vr-field">
                <label className="vr-label">Instagram Handle</label>
                <div className="vr-input-group">
                  <span className="vr-input-group__pre">@</span>
                  <input className="vr-input vr-input--grouped" placeholder="your_handle" value={formData.insta}
                    onChange={(e) => setFormData({ ...formData, insta: e.target.value })} />
                </div>
              </div>
            </div>
          </section>

          {/* ── MEDIA ── */}
          <section id="media" className="vr-section vr-section--last">
            <div className="vr-section__head">
              <span className="vr-section__num">05</span>
              <div>
                <h2 className="vr-section__title">Media &amp; Documents</h2>
                <p className="vr-section__sub">Upload your shop photo and business certificate</p>
              </div>
            </div>

            <div className="vr-media-grid">
              {/* Shop Photo */}
              <div className="vr-upload">
                <p className="vr-upload__label">Shop / Business Photo</p>
                <div
                  className={`vr-upload__zone ${shopPreview ? "has-file" : ""}`}
                  onClick={() => !shopPreview && shopRef.current?.click()}
                >
                  {shopPreview ? (
                    <>
                      <img src={shopPreview} alt="Shop preview" className="vr-upload__img" />
                      <div className="vr-upload__overlay">
                        <button
                          type="button"
                          className="vr-upload__change"
                          onClick={() => !shopPreview && shopRef.current?.click()}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          className="vr-upload__remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImg("shoppicurl", shopRef);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="vr-upload__empty">
                      <div className="vr-upload__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 16l4-4 4 4 4-8 4 8" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                      </div>
                      <p className="vr-upload__title">Upload shop photo</p>
                      <p className="vr-upload__hint">JPG or PNG, max 5 MB</p>
                      <button
                        type="button"
                        className="vr-btn vr-btn--ghost vr-btn--xs"
                        onClick={() => !certPreview && certRef.current?.click()}
                      >
                        Browse
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={shopRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => loadImage(e, "shoppicurl", setShopPreview, setShopPhoto)}
                />
              </div>

              {/* Business Certificate */}
              <div className="vr-upload">
                <p className="vr-upload__label">Business Certificate <span className="vr-opt">— optional</span></p>
                <div
                  className={`vr-upload__zone ${certPreview ? "has-file" : ""}`}
                  onClick={() => !certPreview && certRef.current?.click()}
                >
                  {certPreview ? (
                    <>
                      <img src={certPreview} alt="cert" className="vr-upload__img" />
                      <div className="vr-upload__overlay">
                        <button
                          type="button"
                          className="vr-upload__change"
                          onClick={(e) => {
                            e.stopPropagation();
                            certRef.current?.click();
                          }}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          className="vr-upload__remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImg("certpicurl", certRef);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="vr-upload__empty">
                      <div className="vr-upload__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v13a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="vr-upload__title">Upload certificate</p>
                      <p className="vr-upload__hint">JPG, PNG or PDF, max 5 MB</p>
                      <button
                        type="button"
                        className="vr-btn vr-btn--ghost vr-btn--xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          certRef.current?.click();
                        }}
                      >
                        Browse
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={certRef}
                  type="file"
                  accept="image/*,application/pdf"
                  hidden
                  onChange={(e) => loadImage(e, "certpicurl", setCertPreview, setCertificate)}
                />
              </div>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default VendorRegistration;
