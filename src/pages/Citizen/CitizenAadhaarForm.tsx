import React, { useState, useRef, useEffect } from "react";
import "./CitizenAadhaarForm.css";   // Festora single-page profile styles

import axios from "axios";
// ── Types ──────────────────────────────────────────────────────────────────
interface ExtractedDetails {
  aadhaarNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
}

interface ContactForm {
  city: string;
  address: string;
  contact: string;
}

interface ContactErrors {
  city?: string;
  address?: string;
  contact?: string;
}

type ExtractionStatus = "idle" | "loading" | "done";
type ToastType = "success" | "error" | "info";

interface ToastState {
  type: ToastType;
  text: string;
}

// ── Mock extraction data ───────────────────────────────────────────────────
const EMPTY_CONTACT: ContactForm = { city: "", address: "", contact: "" };
const EMPTY_ERRORS: ContactErrors = {};

// ── Upload Card Component ──────────────────────────────────────────────────
interface UploadCardProps {
  side: "Front" | "Back";
  preview: string | null;
  error: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const UploadCard: React.FC<UploadCardProps> = ({
  side,
  preview,
  error,
  onFile,
  onRemove,
  inputRef,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  
  return (
    <div className="fp-upload-card">
      <div className="fp-upload-card__header">
        <span className="fp-upload-card__badge">{side}</span>
        <div>
          <p className="fp-upload-card__title">Aadhaar {side} Side</p>
          <p className="fp-upload-card__sub">PNG, JPG or JPEG · Max 5 MB</p>
        </div>
      </div>

      <div
        className={[
          "fp-upload-zone",
          preview ? "fp-upload-zone--has-file" : "",
          dragging ? "fp-upload-zone--dragging" : "",
          error ? "fp-upload-zone--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => !preview && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role={preview ? undefined : "button"}
        tabIndex={preview ? undefined : 0}
        onKeyDown={(e) => {
          if (!preview && (e.key === "Enter" || e.key === " "))
            inputRef.current?.click();
        }}
        aria-label={preview ? undefined : `Upload Aadhaar ${side} side image`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={`Aadhaar ${side}`}
              className="fp-upload-zone__img"
            />
            <div className="fp-upload-zone__overlay">
              <button
                type="button"
                className="fp-upload-zone__action fp-upload-zone__action--change"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                aria-label="Replace image"
              >
                Replace
              </button>
              <button
                type="button"
                className="fp-upload-zone__action fp-upload-zone__action--remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                aria-label="Remove image"
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className="fp-upload-zone__empty">
            <div className="fp-upload-zone__icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 16l4-4 4 4 4-8 4 8" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>
            <p className="fp-upload-zone__title">
              {dragging ? "Drop image here" : `Upload ${side.toLowerCase()}-side image`}
            </p>
            <p className="fp-upload-zone__hint">Drag & drop or click to browse</p>
            <button type="button" className="fp-btn fp-btn--primary fp-btn--xs fp-browse-btn">
              Browse File
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="fp-upload-error" role="alert">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        hidden
        onChange={handleChange}
        aria-hidden="true"
      />
    </div>
  );
};

// ── Read-only Detail Field ─────────────────────────────────────────────────
interface DetailFieldProps {
  label: string;
  value: string;
  placeholder: string;
  autofilled: boolean;
  children?: React.ReactNode;
}

const DetailField: React.FC<DetailFieldProps> = ({
  label,
  value,
  placeholder,
  autofilled,
  children,
}) => (
  <div className="fp-detail-field">
    <div className="fp-detail-field__labelrow">
      <label className="fp-label">{label}</label>
      {autofilled && (
        <span className="fp-autofill-badge">Auto-filled</span>
      )}
    </div>
    <div
      className={`fp-detail-wrap ${!value ? "fp-detail-wrap--empty" : ""}`}
    >
      <span className="fp-lock-dot" aria-hidden="true" />
      {children ? (
        children
      ) : (
        <span
          className={`fp-detail-value ${!value ? "fp-detail-value--placeholder" : ""}`}
        >
          {value || placeholder}
        </span>
      )}
    </div>
  </div>
);

const extractAadhaarDetails = async (file: File) => {
  const formData = new FormData();

  // The key must match req.files.aadhaarImage
  formData.append("aadhaarImage", file);

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/citizen/extract-aadhaar`,
    formData
  );

  return response.data.details;
};

// ── Main Component ─────────────────────────────────────────────────────────
const CitizenAadhaarForm: React.FC = () => {
  // Image state
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);

  // Extraction state
  const [extraction, setExtraction] = useState<ExtractionStatus>("idle");
  const [details, setDetails] = useState<ExtractedDetails | null>(null);
  const [aadhaarVisible, setAadhaarVisible] = useState(false);

  // Contact form state
  const [contact, setContact] = useState<ContactForm>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>(EMPTY_ERRORS);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactForm, boolean>>>({});

  // UI state
  const [toast, setToast] = useState<ToastState | null>(null);
  const [fetchEmail, setFetchEmail] = useState("");
  const [fetching, setFetching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState("upload");
  const [submitted, setSubmitted] = useState(false);

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  // Section refs (scroll-spy kept as-is; now only reflected in a data attribute)
  const sectionRefs = {
    upload: useRef<HTMLDivElement>(null),
    personal: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // ── Scroll-spy ────────────────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.values(sectionRefs).forEach((r) => r.current && observer.observe(r.current));
    return () => observer.disconnect();
  }, []);
  // Release preview URLs when they change or the component unmounts.
  useEffect(() => {
    return () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
    };
  }, [frontPreview]);

  useEffect(() => {
    return () => {
      if (backPreview) URL.revokeObjectURL(backPreview);
    };
  }, [backPreview]);

  // ── Trigger mock extraction when both images uploaded ───────────────────


  useEffect(() => {
    if (!frontFile || !backFile) return;

    let cancelled = false;

    const runGemini = async () => {
      setExtraction("loading");
      setDetails(null);

      try {
        // Send both images to the backend separately
        const [frontDetails, backDetails] = await Promise.all([
          extractAadhaarDetails(frontFile),
          extractAadhaarDetails(backFile),
        ]);

        if (cancelled) return;

        // Combine details extracted from both sides
        setDetails({
          aadhaarNumber:
            frontDetails.aadhaar_number ||
            backDetails.aadhaar_number ||
            "",
          fullName:
            frontDetails.name || backDetails.name || "",
          dateOfBirth:
            frontDetails.dob || backDetails.dob || "",
          gender:
            frontDetails.gender || backDetails.gender || "",
        });

        // The back side commonly contains the address
        setContact((previous) => ({
          ...previous,
          address:
            backDetails.address ||
            frontDetails.address ||
            previous.address,
        }));

        setExtraction("done");
        showToast("success", "Gemini extraction completed.");
      } catch (error) {
        if (cancelled) return;

        console.error("Gemini extraction failed:", error);
        setExtraction("idle");
        showToast(
          "error",
          "Could not extract details. Please try again."
        );
      }
    };

    runGemini();

    return () => {
      cancelled = true;
    };
  }, [frontFile, backFile]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (type: ToastType, text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

 
const handleFetch = async (emailToFetch: string = fetchEmail) => {

  if (!emailToFetch.trim()) {
    return;
  }

  setFetching(true);

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/citizen/fetch`,
      {
        params: {
          emailid: emailToFetch.trim()
        }
      }
    );

    const citizen = res.data.citizen;

    // Fill personal details
    setDetails({
      aadhaarNumber: String(citizen.adharCard ?? ""),
      fullName: citizen.name ?? "",
      dateOfBirth: citizen.dob
        ? String(citizen.dob).slice(0, 10)
        : "",
      gender: citizen.gender ?? ""
    });

    // Fill contact details
    setContact({
      city: citizen.city ?? "",
      address: citizen.address ?? "",
      contact: String(citizen.contact ?? "")
    });

    setExtraction("done");
    setErrors({});
    setTouched({});
    setSubmitted(false);

    showToast("success", "Profile loaded successfully.");

  } catch (err: any) {

    if (err.response?.status === 404) {
      console.log("New user: No existing profile found.");
    } else {
      console.error("Profile lookup failed:", err);
      showToast("error", "Failed to load profile.");
    }

  } finally {
    setFetching(false);
  }
};


// Automatically fetch logged-in user's profile
useEffect(() => {

  const email = localStorage.getItem("email");

  if (email) {
    setFetchEmail(email);
    handleFetch(email);
  } else {
    console.error("Email not found in localStorage");
  }

}, []);


  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
  const MAX_SIZE_MB = 5;

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type))
      return "Only PNG, JPG or JPEG images are allowed.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024)
      return `File size must be under ${MAX_SIZE_MB} MB.`;
    return null;
  };

  const handleFrontFile = (file: File) => {
    const err = validateFile(file);
    if (err) { setFrontError(err); return; }
    setFrontError(null);
    const url = URL.createObjectURL(file);
    setFrontFile(file);
    setFrontPreview(url);
    if (backFile) resetExtraction();
  };

  const handleBackFile = (file: File) => {
    const err = validateFile(file);
    if (err) { setBackError(err); return; }
    setBackError(null);
    const url = URL.createObjectURL(file);
    setBackFile(file);
    setBackPreview(url);
    if (frontFile) resetExtraction();
  };

  const handleFrontRemove = () => {
    setFrontFile(null);
    setFrontPreview(null);
    setFrontError(null);
    resetExtraction();
  };

  const handleBackRemove = () => {
    setBackFile(null);
    setBackPreview(null);
    setBackError(null);
    resetExtraction();
  };

  const resetExtraction = () => {
    setExtraction("idle");
    setDetails(null);
    setAadhaarVisible(false);
  };

  // ── Contact validation ───────────────────────────────────────────────────
  const validateContact = (): ContactErrors => {
    const e: ContactErrors = {};
    if (!contact.city.trim()) e.city = "City is required.";
    if (!contact.address.trim()) e.address = "Address is required.";
    if (!contact.contact.trim()) {
      e.contact = "Contact number is required.";
    } else if (!/^[6-9]\d{9}$/.test(contact.contact.trim())) {
      e.contact = "Enter a valid 10-digit Indian mobile number.";
    }
    return e;
  };

  const touchAll = () =>
    setTouched({ city: true, address: true, contact: true });

  const fieldError = (key: keyof ContactForm): string | undefined =>
    touched[key] ? errors[key] : undefined;

  // ── Profile completion score ─────────────────────────────────────────────
  const score = Math.round(
    ([
      !!frontFile,
      !!backFile,
      extraction === "done",
      !!contact.city.trim(),
      !!contact.address.trim(),
      !!contact.contact.trim(),
    ].filter(Boolean).length / 6) * 100
  );

  // ── Initials avatar ───────────────────────────────────────────────────────
  const initials = details?.fullName
    ? details.fullName.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  // ── Action handlers ──────────────────────────────────────────────────────

  const handleUpload = async () => {
    touchAll();

    const errs = validateContact();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast("error", "Please fix the errors before submitting.");
      return;
    }

    if (!fetchEmail.trim()) {
      showToast("error", "Please enter an email address.");
      return;
    }

    if (!details?.fullName || !details?.aadhaarNumber) {
      showToast("error", "Extract Aadhaar details before submitting.");
      return;
    }

    try {
      const payload = {
        emailid: fetchEmail.trim().toLowerCase(),
        name: details.fullName,
        contact: contact.contact,
        gender: details.gender,
        adharCard: details.aadhaarNumber.replace(/\s/g, ""),
        dob: details.dateOfBirth || undefined,
        city: contact.city,
        address: contact.address,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/citizen/register`,
        payload
      );

      console.log("Citizen saved:", response.data);

      showToast("success", "Client details saved to MongoDB.");
      setSubmitted(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Save failed:", error.response?.data || error.message);

        showToast(
          "error",
          error.response?.data?.message || "Failed to save client details."
        );
      } else {
        console.error(error);
        showToast("error", "An unexpected error occurred.");
      }
    }
  };

  const handleModify = () => setShowConfirm(true);

  const handleConfirmReset = () => {
    setFrontFile(null);
    setBackFile(null);
    setFrontPreview(null); setBackPreview(null);
    setFrontError(null); setBackError(null);
    resetExtraction();
    setContact(EMPTY_CONTACT);
    setErrors(EMPTY_ERRORS);
    setTouched({});
    setShowConfirm(false);
    setSubmitted(false);
    showToast("info", "Form has been reset. You can start again.");
  };

  // ── Aadhaar masking ──────────────────────────────────────────────────────
  const maskedAadhaar = (num: string) => {
    const clean = num.replace(/\s/g, "");
    return `XXXX XXXX ${clean.slice(-4)}`;
  };

  // ── Shared pieces ─────────────────────────────────────────────────────────
  const toastView = toast && (
    <div
      className={`fp-toast fp-toast--${toast.type}`}
      role="alert"
      aria-live="assertive"
      key={toast.text}
    >
      {toast.type === "success" && <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
      {toast.type === "error" && <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
      {toast.type === "info" && <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>}
      <span>{toast.text}</span>
    </div>
  );

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fp-page fp-page--center">
        {toastView}
        <div className="fp-success">
          <div className="fp-success__ring">
            <svg viewBox="0 0 52 52" className="fp-success__svg">
              <circle cx="26" cy="26" r="25" fill="none" />
              <path d="M14 27l8 8 16-16" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="fp-success__title">Submission Complete</h2>
          <p className="fp-success__text">
            Client details for <strong>{details?.fullName || "the client"}</strong> have been
            successfully submitted.
          </p>
          <div className="fp-success__tags">
            {contact.city && <span className="fp-tag">📍 {contact.city}</span>}
            {details?.gender && <span className="fp-tag">{details.gender}</span>}
          </div>
          <div className="fp-success__actions">
            <button
              type="button"
              className="fp-btn fp-btn--primary"
              onClick={handleConfirmReset}
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="fp-page" data-section={activeSection}>

      {/* ── Toast ── */}
      {toastView}

      {/* ── Confirm Dialog ── */}
      {showConfirm && (
        <div
          className="fp-dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <div className="fp-dialog">
            <div className="fp-dialog__icon" aria-hidden="true">!</div>
            <h3 id="dialog-title" className="fp-dialog__title">Reset Form?</h3>
            <p className="fp-dialog__body">
              This will clear all uploaded images, extracted Aadhaar details,
              and your contact information. This action cannot be undone.
            </p>
            <div className="fp-dialog__actions">
              <button
                type="button"
                className="fp-btn fp-btn--outline"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="fp-btn fp-btn--danger"
                onClick={handleConfirmReset}
              >
                Yes, Reset Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Navbar ── */}
    {/* Top Navbar */}
<header className="fp-nav">
  <div className="fp-nav__inner">
    <div className="fp-brand">
      <span className="fp-brand__logo" aria-hidden="true">
        {/* Keep your existing SVG here */}
      </span>
    </div>

    <span className="fp-nav__label">Citizen Profile</span>

    <div className="fp-nav__actions">
      <button
        type="button"
        className="fp-btn fp-btn--outline fp-btn--sm"
        onClick={handleModify}
      >
        Reset Form
      </button>

      <button
        type="button"
        className="fp-btn fp-btn--primary fp-btn--sm"
        onClick={handleUpload}
        disabled={fetching}
      >
        {fetching ? <span className="fp-spin" /> : "Upload Data"}
      </button>
    </div>
  </div>
</header>

<main className="fp-main">

        {/* ── Page introduction ── */}
        <section className="fp-intro">
          <div className="fp-intro__text">
            <span className="fp-eyebrow">Citizen Profile</span>
            <h1 className="fp-title">Complete Your <em>Profile</em></h1>
            <p className="fp-subtitle">
              Share your details to make your event-planning experience seamless.
            </p>
          </div>

          {/* <div className="fp-summary" aria-live="polite">
            <div className="fp-summary__avatar" aria-hidden="true">{initials}</div>
            <div className="fp-summary__body">
              <p className="fp-summary__name">{details?.fullName || "Client Name"}</p>
              <div className="fp-progress" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
                <div className="fp-progress__fill" style={{ width: `${score}%` }} />
              </div>
              <p className="fp-summary__label">Profile {score}% complete</p>
            </div>
          </div> */}
        </section>

        {/* ── One continuous form ── */}
        <form className="fp-form" onSubmit={(e) => e.preventDefault()} noValidate>

          {/* ── Aadhaar Upload ── */}
          <section
            id="upload"
            ref={sectionRefs.upload}
            className="fp-card"
            aria-labelledby="upload-heading"
          >
            <div className="fp-card__head">
              <span className="fp-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <circle cx="9" cy="11" r="2" />
                  <path d="M6.5 16c.5-1.6 1.6-2.4 2.5-2.4s2 .8 2.5 2.4M14 10h4M14 13.5h3" />
                </svg>
              </span>
              <div>
                <h2 id="upload-heading" className="fp-card__title">Aadhaar Card Upload</h2>
                <p className="fp-card__sub">
                  Upload both sides of your Aadhaar card. Once both are uploaded,
                  details will be extracted automatically.
                </p>
              </div>
            </div>

            <div className="fp-upload-grid">
              <UploadCard
                side="Front"
                preview={frontPreview}
                error={frontError}
                onFile={handleFrontFile}
                onRemove={handleFrontRemove}
                inputRef={frontRef}
              />
              <UploadCard
                side="Back"
                preview={backPreview}
                error={backError}
                onFile={handleBackFile}
                onRemove={handleBackRemove}
                inputRef={backRef}
              />
            </div>
          </section>

          {/* ── Personal Details ── */}
          <section
            id="personal"
            ref={sectionRefs.personal}
            className="fp-card"
            aria-labelledby="details-heading"
          >
            <div className="fp-card__head">
              <span className="fp-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
                </svg>
              </span>
              <div>
                <h2 id="details-heading" className="fp-card__title">Personal Details</h2>
                <p className="fp-card__sub">
                  These fields are read-only and auto-filled from your Aadhaar
                  card. They cannot be edited manually.
                </p>
              </div>
              <span className="fp-card__note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
                </svg>
                Extracted automatically from Aadhaar
              </span>
            </div>

            {/* Extraction loading state */}
            {extraction === "loading" && (
              <div className="fp-loader" role="status" aria-live="polite">
                <span className="fp-loader__spin" aria-hidden="true" />
                <span>Extracting details from your Aadhaar card…</span>
              </div>
            )}

            {/* Details grid */}
            <div className="fp-fields">

              {/* Aadhaar Number with reveal toggle */}
              <DetailField
                label="Aadhaar Number"
                value={details?.aadhaarNumber ?? ""}
                placeholder="Will be auto-filled after upload"
                autofilled={extraction === "done"}
              >
                <div className="fp-reveal">
                  <span
                    className={`fp-detail-value ${!details ? "fp-detail-value--placeholder" : ""}`}
                  >
                    {details
                      ? aadhaarVisible
                        ? details.aadhaarNumber
                        : maskedAadhaar(details.aadhaarNumber)
                      : "Will be auto-filled after upload"}
                  </span>
                  {details && (
                    <button
                      type="button"
                      className="fp-reveal-btn"
                      onClick={() => setAadhaarVisible((v) => !v)}
                      aria-label={aadhaarVisible ? "Hide Aadhaar number" : "Show Aadhaar number"}
                    >
                      {aadhaarVisible ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
              </DetailField>

              <DetailField
                label="Full Name"
                value={details?.fullName ?? ""}
                placeholder="Will be auto-filled after upload"
                autofilled={extraction === "done"}
              />

              <DetailField
                label="Date of Birth"
                value={details?.dateOfBirth ?? ""}
                placeholder="Will be auto-filled after upload"
                autofilled={extraction === "done"}
              />

              <DetailField
                label="Gender"
                value={details?.gender ?? ""}
                placeholder="Will be auto-filled after upload"
                autofilled={extraction === "done"}
              />
            </div>

            {extraction === "idle" && !frontFile && !backFile && (
              <p className="fp-detail-hint">
                Upload both Aadhaar sides above to extract your personal details automatically.
              </p>
            )}
          </section>

          {/* ── Contact Details ── */}
          <section
            id="contact"
            ref={sectionRefs.contact}
            className="fp-card"
            aria-labelledby="contact-heading"
          >
            <div className="fp-card__head">
              <span className="fp-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div>
                <h2 id="contact-heading" className="fp-card__title">Contact Details</h2>
                <p className="fp-card__sub">
                  Provide your current contact and address information. These
                  fields are editable.
                </p>
              </div>
            </div>

            <div className="fp-fields">

              {/* Email ID */}
              <div className="fp-field fp-field--full">
                <label htmlFor="ca-email" className="fp-label">
                  Email ID <span className="fp-req">*</span>
                </label>

                <input
                  id="ca-email"
                  type="email"
                  className="fp-input"
                  placeholder="Enter your email address"
                  value={fetchEmail}
                  onChange={(e) => setFetchEmail(e.target.value)}
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="fp-field">
                <label htmlFor="ca-contact" className="fp-label">
                  Contact Number{" "}
                  <span className="fp-req" aria-label="required">*</span>
                </label>
                <div className={`fp-input-group ${fieldError("contact") ? "fp-input-group--error" : ""}`}>
                  <span className="fp-input-group__pre" aria-hidden="true">
                    +91
                  </span>
                  <input
                    id="ca-contact"
                    type="tel"
                    className="fp-input fp-input--grouped"
                    placeholder="Enter your 10-digit mobile number"
                    value={contact.contact}
                    maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setContact((p) => ({ ...p, contact: val }));
                      if (touched.contact) {
                        const isValid = /^[6-9]\d{9}$/.test(val);
                        setErrors((p) => ({
                          ...p,
                          contact: !val
                            ? "Contact number is required."
                            : !isValid
                              ? "Enter a valid 10-digit Indian mobile number."
                              : undefined,
                        }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((p) => ({ ...p, contact: true }));
                      const val = contact.contact.trim();
                      setErrors((p) => ({
                        ...p,
                        contact: !val
                          ? "Contact number is required."
                          : !/^[6-9]\d{9}$/.test(val)
                            ? "Enter a valid 10-digit Indian mobile number."
                            : undefined,
                      }));
                    }}
                    aria-required="true"
                    aria-describedby={fieldError("contact") ? "ca-contact-err" : undefined}
                  />
                </div>
                {fieldError("contact") && (
                  <span id="ca-contact-err" className="fp-err" role="alert">
                    {fieldError("contact")}
                  </span>
                )}
              </div>

              {/* City */}
              <div className="fp-field">
                <label htmlFor="ca-city" className="fp-label">
                  City <span className="fp-req" aria-label="required">*</span>
                </label>
                <input
                  id="ca-city"
                  type="text"
                  className={`fp-input ${fieldError("city") ? "fp-input--error" : ""}`}
                  placeholder="Enter your city"
                  value={contact.city}
                  onChange={(e) => {
                    setContact((p) => ({ ...p, city: e.target.value }));
                    if (touched.city)
                      setErrors((p) => ({
                        ...p,
                        city: e.target.value.trim() ? undefined : "City is required.",
                      }));
                  }}
                  onBlur={() => {
                    setTouched((p) => ({ ...p, city: true }));
                    setErrors((p) => ({
                      ...p,
                      city: contact.city.trim() ? undefined : "City is required.",
                    }));
                  }}
                  aria-required="true"
                  aria-describedby={fieldError("city") ? "ca-city-err" : undefined}
                />
                {fieldError("city") && (
                  <span id="ca-city-err" className="fp-err" role="alert">
                    {fieldError("city")}
                  </span>
                )}
              </div>

              {/* Address — full width */}
              <div className="fp-field fp-field--full">
                <label htmlFor="ca-address" className="fp-label">
                  Complete Address <span className="fp-req" aria-label="required">*</span>
                </label>
                <textarea
                  id="ca-address"
                  className={`fp-input fp-textarea ${fieldError("address") ? "fp-input--error" : ""}`}
                  placeholder="Enter your complete address"
                  rows={3}
                  value={contact.address}
                  onChange={(e) => {
                    setContact((p) => ({ ...p, address: e.target.value }));
                    if (touched.address)
                      setErrors((p) => ({
                        ...p,
                        address: e.target.value.trim() ? undefined : "Address is required.",
                      }));
                  }}
                  onBlur={() => {
                    setTouched((p) => ({ ...p, address: true }));
                    setErrors((p) => ({
                      ...p,
                      address: contact.address.trim() ? undefined : "Address is required.",
                    }));
                  }}
                  aria-required="true"
                  aria-describedby={fieldError("address") ? "ca-address-err" : undefined}
                />
                {fieldError("address") && (
                  <span id="ca-address-err" className="fp-err" role="alert">
                    {fieldError("address")}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* ── Form Actions ── */}
          <div className="fp-actions">
            <button type="button" className="fp-btn fp-btn--outline fp-btn--lg" onClick={handleModify}>
              Reset Form
            </button>
            <button type="button" className="fp-btn fp-btn--primary fp-btn--lg" onClick={handleUpload}>
              Upload Data
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CitizenAadhaarForm;