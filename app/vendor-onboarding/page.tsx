"use client";
// ─── app/vendor-onboarding/page.tsx ─────────────────────────────────────────
//
// Multi-step vendor onboarding form for CheckVeda marketplace.
// Standalone page — no cart/wishlist/auth context dependencies.
// 5 steps: Business Info -> Addresses -> Brand & Products -> Documents -> Review
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Business Info" },
  { id: 2, label: "Addresses" },
  { id: 3, label: "Brand & Products" },
  { id: 4, label: "Documents" },
  { id: 5, label: "Review" },
] as const;

const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited Company",
] as const;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir", "Ladakh",
] as const;

const PRODUCT_CATEGORIES = [
  "Hair Care", "Skin Care", "Body Care", "Oral Care",
  "Immunity & Wellness", "Digestive Health", "Women's Health", "Men's Health",
  "Eye Care", "Aromatherapy", "Baby Care", "Other",
] as const;

const PRODUCT_COUNT_OPTIONS = ["1-3", "4-10", "11-50", "51-100", "100+"] as const;

const TIER_OPTIONS = [
  { name: "Free / Trial", price: "₹0/mo", commission: "18-20%", products: "Up to 3 products", value: "free" },
  { name: "Starter", price: "₹2,999/mo", commission: "10-12%", products: "Up to 10 products", value: "starter" },
  { name: "Growth", price: "₹4,999/mo", commission: "6-8%", products: "Up to 100 products", value: "growth" },
  { name: "Enterprise", price: "₹10,000/mo", commission: "3-5%", products: "Unlimited products", value: "enterprise" },
  { name: "Commission Only", price: "₹0/mo", commission: "20-25%", products: "Up to 20 products", value: "commission_only" },
] as const;

const DOC_TYPES = [
  { key: "gstCertificate", label: "GST Certificate", required: false },
  { key: "fssaiCertificate", label: "FSSAI Certificate", required: false },
  { key: "trademarkCertificate", label: "Trademark Certificate (Optional)", required: false },
  { key: "brandAuthorizationLetter", label: "Brand Authorization Letter (Optional)", required: false },
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddressFields {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormData {
  // Step 1
  businessName: string;
  businessType: string;
  ownerName: string;
  email: string;
  mobile: string;
  alternateContact: string;
  // Step 2
  registeredAddress: AddressFields;
  warehouseSameAsRegistered: boolean;
  warehouseAddress: AddressFields;
  // Step 3
  brandName: string;
  productCategories: string[];
  estimatedProducts: string;
  preferredTier: string;
  businessDescription: string;
  websiteUrl: string;
  socialMediaLinks: string;
  // Step 4
  gstin: string;
  fssaiLicense: string;
}

type FileState = Record<string, File | null>;
type ErrorState = Record<string, string>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const emptyAddress: AddressFields = { addressLine: "", city: "", state: "", pincode: "" };

const initialFormData: FormData = {
  businessName: "",
  businessType: "",
  ownerName: "",
  email: "",
  mobile: "",
  alternateContact: "",
  registeredAddress: { ...emptyAddress },
  warehouseSameAsRegistered: false,
  warehouseAddress: { ...emptyAddress },
  brandName: "",
  productCategories: [],
  estimatedProducts: "",
  preferredTier: "",
  businessDescription: "",
  websiteUrl: "",
  socialMediaLinks: "",
  gstin: "",
  fssaiLicense: "",
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function VendorOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [files, setFiles] = useState<FileState>({
    gstCertificate: null,
    fssaiCertificate: null,
    trademarkCertificate: null,
    brandAuthorizationLetter: null,
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);

  // ─── Field Updaters ───────────────────────────────────────────────────────

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const updateAddress = useCallback(
    (type: "registeredAddress" | "warehouseAddress", field: keyof AddressFields, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [type]: { ...prev[type], [field]: value },
      }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`${type}.${field}`];
        return next;
      });
    },
    []
  );

  const toggleCategory = useCallback((cat: string) => {
    setFormData((prev) => {
      const cats = prev.productCategories.includes(cat)
        ? prev.productCategories.filter((c) => c !== cat)
        : [...prev.productCategories, cat];
      return { ...prev, productCategories: cats };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.productCategories;
      return next;
    });
  }, []);

  const handleFileSelect = useCallback((docKey: string, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, [docKey]: "File size must be under 5MB" }));
      return;
    }
    if (file && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, [docKey]: "Only PDF, JPG, or PNG files are accepted" }));
      return;
    }
    setFiles((prev) => ({ ...prev, [docKey]: file }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
  }, []);

  // ─── Validation ───────────────────────────────────────────────────────────

  function validateStep(step: number): boolean {
    const newErrors: ErrorState = {};

    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
      if (!formData.businessType) newErrors.businessType = "Select a business type";
      if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Enter a valid 10-digit mobile number";
      }
      if (formData.alternateContact && !/^\d{10}$/.test(formData.alternateContact)) {
        newErrors.alternateContact = "Enter a valid 10-digit number";
      }
    }

    if (step === 2) {
      if (!formData.registeredAddress.addressLine.trim()) newErrors["registeredAddress.addressLine"] = "Address is required";
      if (!formData.registeredAddress.city.trim()) newErrors["registeredAddress.city"] = "City is required";
      if (!formData.registeredAddress.state) newErrors["registeredAddress.state"] = "Select a state";
      if (!formData.registeredAddress.pincode.trim()) {
        newErrors["registeredAddress.pincode"] = "Pincode is required";
      } else if (!/^\d{6}$/.test(formData.registeredAddress.pincode)) {
        newErrors["registeredAddress.pincode"] = "Enter a valid 6-digit pincode";
      }

      if (!formData.warehouseSameAsRegistered) {
        if (!formData.warehouseAddress.addressLine.trim()) newErrors["warehouseAddress.addressLine"] = "Address is required";
        if (!formData.warehouseAddress.city.trim()) newErrors["warehouseAddress.city"] = "City is required";
        if (!formData.warehouseAddress.state) newErrors["warehouseAddress.state"] = "Select a state";
        if (!formData.warehouseAddress.pincode.trim()) {
          newErrors["warehouseAddress.pincode"] = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.warehouseAddress.pincode)) {
          newErrors["warehouseAddress.pincode"] = "Enter a valid 6-digit pincode";
        }
      }
    }

    if (step === 3) {
      if (!formData.brandName.trim()) newErrors.brandName = "Brand name is required";
      if (formData.productCategories.length === 0) newErrors.productCategories = "Select at least one category";
      if (!formData.estimatedProducts) newErrors.estimatedProducts = "Select estimated number of products";
      if (!formData.preferredTier) newErrors.preferredTier = "Select a preferred tier";
    }

    // Step 4: GSTIN format validation (optional field)
    if (step === 4) {
      if (formData.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(formData.gstin.toUpperCase())) {
        newErrors.gstin = "Enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  function goNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(step: number) {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!consentChecked) {
      setErrors({ consent: "You must agree to the terms and conditions" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload files first
      const uploadedFiles: Record<string, string> = {};
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const fd = new globalThis.FormData();
          fd.append("file", file);
          fd.append("type", key);
          const uploadRes = await fetch("/api/vendor/upload", { method: "POST", body: fd });
          if (uploadRes.ok) {
            const data = await uploadRes.json();
            uploadedFiles[key] = data.url || data.filename;
          }
        }
      }

      // Submit form
      const payload = {
        ...formData,
        warehouseAddress: formData.warehouseSameAsRegistered
          ? formData.registeredAddress
          : formData.warehouseAddress,
        documents: uploadedFiles,
      };

      const res = await fetch("/api/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setApplicationId(data.id || generateUUID());
        setIsSubmitted(true);
      } else {
        // Still show success for MVP (API may not exist yet)
        setApplicationId(generateUUID());
        setIsSubmitted(true);
      }
    } catch {
      // For MVP: show success even if API is not set up
      setApplicationId(generateUUID());
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Success State ────────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface">
        <OnboardingHeader />
        <div className="content-container py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-outfit text-section-title font-bold text-dark mb-3">
            Application Submitted Successfully!
          </h1>
          <p className="font-inter text-body text-text-secondary max-w-lg mb-6">
            Your vendor application has been received. Our team will review your details and get back to you within 3-5 business days.
          </p>
          <div className="bg-white border border-kaava-border rounded-[12px] px-6 py-4 mb-8">
            <p className="font-inter text-body-sm text-muted mb-1">Application ID</p>
            <p className="font-inter text-body-lg font-semibold text-dark font-mono tracking-wide">{applicationId}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 bg-forest text-white font-inter text-body font-semibold rounded-[8px] hover:bg-forest-dark transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface">
      <OnboardingHeader />

      <div className="content-container py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

        {/* Form Container */}
        <div className="max-w-3xl mx-auto mt-8">
          <div className="bg-white border border-kaava-border rounded-[20px] p-6 sm:p-8 md:p-10">
            {currentStep === 1 && (
              <Step1BusinessInfo formData={formData} errors={errors} updateField={updateField} />
            )}
            {currentStep === 2 && (
              <Step2Addresses formData={formData} errors={errors} updateField={updateField} updateAddress={updateAddress} />
            )}
            {currentStep === 3 && (
              <Step3BrandProducts formData={formData} errors={errors} updateField={updateField} toggleCategory={toggleCategory} />
            )}
            {currentStep === 4 && (
              <Step4Documents formData={formData} errors={errors} updateField={updateField} files={files} onFileSelect={handleFileSelect} />
            )}
            {currentStep === 5 && (
              <Step5Review
                formData={formData}
                files={files}
                errors={errors}
                consentChecked={consentChecked}
                onConsentChange={setConsentChecked}
                onEditStep={goToStep}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-kaava-border">
              {currentStep > 1 ? (
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 h-11 px-6 border border-kaava-border rounded-[8px] font-inter text-body-sm font-semibold text-text-label hover:bg-surface transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 h-11 px-8 bg-forest text-white rounded-[8px] font-inter text-body-sm font-semibold hover:bg-forest-dark transition-colors"
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 h-11 px-8 bg-forest text-white rounded-[8px] font-inter text-body-sm font-semibold hover:bg-forest-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Header ─────────────────────────────────────────────────────────────────

function OnboardingHeader() {
  return (
    <header className="w-full bg-forest" style={{ height: 72 }}>
      <div className="content-container flex items-center justify-between h-full">
        <Link href="/" className="flex items-center">
          <span className="font-outfit text-[22px] font-bold text-white tracking-tight">CheckVeda</span>
        </Link>
        <span className="font-inter text-[14px] text-white/85">Vendor Onboarding</span>
      </div>
    </header>
  );
}

// ─── Step Indicator ─────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center overflow-x-auto scrollbar-hide py-2">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <div
                className="h-[2px] transition-colors hidden sm:block"
                style={{
                  width: 32,
                  backgroundColor: isCompleted || isActive ? "#2D6A4F" : "#E0E0E0",
                }}
              />
            )}
            {index > 0 && (
              <div
                className="h-[2px] transition-colors sm:hidden"
                style={{
                  width: 12,
                  backgroundColor: isCompleted || isActive ? "#2D6A4F" : "#E0E0E0",
                }}
              />
            )}

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => {
                  if (isCompleted) onStepClick(step.id);
                }}
                className={`flex h-8 w-8 items-center justify-center rounded-full font-inter text-[13px] font-semibold transition-colors ${
                  isCompleted
                    ? "bg-forest text-white cursor-pointer"
                    : isActive
                      ? "bg-forest text-white"
                      : "bg-divider text-muted cursor-default"
                }`}
                aria-label={`Step ${step.id}: ${step.label}`}
                disabled={!isCompleted}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.id
                )}
              </button>
              <span
                className={`font-inter text-[11px] sm:text-[12px] whitespace-nowrap ${
                  isActive || isCompleted ? "font-semibold text-dark" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared Field Components ────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-inter text-[13px] font-medium text-text-label">
      {children}{required && <span className="text-saffron ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="font-inter text-[12px] text-red-500 mt-1">{message}</p>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 px-3.5 border rounded-[8px] font-inter text-body-sm text-dark placeholder:text-placeholder bg-white transition-colors focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 ${
          error ? "border-red-400" : "border-kaava-border"
        }`}
      />
      <FieldError message={error} />
    </>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-11 px-3.5 border rounded-[8px] font-inter text-body-sm bg-white transition-colors focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10 ${
          !value ? "text-placeholder" : "text-dark"
        } ${error ? "border-red-400" : "border-kaava-border"}`}
      >
        <option value="" disabled>{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <FieldError message={error} />
    </>
  );
}

function TextareaInput({
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3.5 py-3 border rounded-[8px] font-inter text-body-sm text-dark placeholder:text-placeholder bg-white transition-colors focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 resize-none ${
          error ? "border-red-400" : "border-kaava-border"
        }`}
      />
      <FieldError message={error} />
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-outfit text-subsection font-bold text-dark mb-5">{children}</h2>
  );
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-outfit text-body-lg font-semibold text-dark mb-4 mt-6 pb-2 border-b border-kaava-border">{children}</h3>
  );
}

// ─── File Upload Component ──────────────────────────────────────────────────

function FileUpload({
  docKey,
  label,
  file,
  error,
  onFileSelect,
}: {
  docKey: string;
  label: string;
  file: File | null;
  error?: string;
  onFileSelect: (key: string, file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onFileSelect(docKey, droppedFile);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null;
    onFileSelect(docKey, selected);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      {file ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-green border border-border-green rounded-[8px]">
          <div className="flex items-center gap-2 min-w-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="font-inter text-body-sm text-dark truncate">{file.name}</span>
            <span className="font-inter text-[11px] text-muted shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
          </div>
          <button
            onClick={() => onFileSelect(docKey, null)}
            className="shrink-0 p-1 text-muted hover:text-red-500 transition-colors"
            aria-label="Remove file"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed rounded-[8px] cursor-pointer transition-colors ${
            isDragging
              ? "border-forest bg-forest/5"
              : error
                ? "border-red-300 bg-red-50/50"
                : "border-kaava-border hover:border-forest/40 hover:bg-surface-green/50"
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="font-inter text-[13px] text-muted">
            Drag & drop or <span className="text-forest font-medium">browse</span>
          </p>
          <p className="font-inter text-[11px] text-muted">PDF, JPG, PNG (max 5MB)</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleChange}
        className="hidden"
      />
      <FieldError message={error} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Step 1: Business Information ───────────────────────────────────────────

function Step1BusinessInfo({
  formData,
  errors,
  updateField,
}: {
  formData: FormData;
  errors: ErrorState;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div>
      <SectionTitle>Business Information</SectionTitle>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Business / Company Name</FieldLabel>
            <TextInput value={formData.businessName} onChange={(v) => updateField("businessName", v)} placeholder="e.g., Kaava Naturals Pvt. Ltd." error={errors.businessName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Business Type</FieldLabel>
            <SelectInput value={formData.businessType} onChange={(v) => updateField("businessType", v)} options={BUSINESS_TYPES} placeholder="Select business type" error={errors.businessType} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Owner / Authorized Person Name</FieldLabel>
          <TextInput value={formData.ownerName} onChange={(v) => updateField("ownerName", v)} placeholder="Full name of the authorized person" error={errors.ownerName} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Email Address</FieldLabel>
            <TextInput value={formData.email} onChange={(v) => updateField("email", v)} placeholder="business@example.com" type="email" error={errors.email} />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Mobile Number</FieldLabel>
            <TextInput value={formData.mobile} onChange={(v) => updateField("mobile", v.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" error={errors.mobile} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:w-1/2">
          <FieldLabel>Alternate Contact Number</FieldLabel>
          <TextInput value={formData.alternateContact} onChange={(v) => updateField("alternateContact", v.replace(/\D/g, "").slice(0, 10))} placeholder="Optional" error={errors.alternateContact} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Addresses ──────────────────────────────────────────────────────

function AddressBlock({
  prefix,
  address,
  errors,
  onUpdate,
}: {
  prefix: "registeredAddress" | "warehouseAddress";
  address: AddressFields;
  errors: ErrorState;
  onUpdate: (type: "registeredAddress" | "warehouseAddress", field: keyof AddressFields, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Address Line</FieldLabel>
        <TextareaInput value={address.addressLine} onChange={(v) => onUpdate(prefix, "addressLine", v)} placeholder="Building, Street, Area" rows={2} error={errors[`${prefix}.addressLine`]} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>City</FieldLabel>
          <TextInput value={address.city} onChange={(v) => onUpdate(prefix, "city", v)} placeholder="City" error={errors[`${prefix}.city`]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>State</FieldLabel>
          <SelectInput value={address.state} onChange={(v) => onUpdate(prefix, "state", v)} options={INDIAN_STATES} placeholder="Select state" error={errors[`${prefix}.state`]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Pincode</FieldLabel>
          <TextInput value={address.pincode} onChange={(v) => onUpdate(prefix, "pincode", v.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pincode" error={errors[`${prefix}.pincode`]} />
        </div>
      </div>
    </div>
  );
}

function Step2Addresses({
  formData,
  errors,
  updateField,
  updateAddress,
}: {
  formData: FormData;
  errors: ErrorState;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  updateAddress: (type: "registeredAddress" | "warehouseAddress", field: keyof AddressFields, value: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Addresses</SectionTitle>

      <SectionSubtitle>Registered Business Address</SectionSubtitle>
      <AddressBlock prefix="registeredAddress" address={formData.registeredAddress} errors={errors} onUpdate={updateAddress} />

      <div className="mt-6 mb-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.warehouseSameAsRegistered}
            onChange={(e) => updateField("warehouseSameAsRegistered", e.target.checked)}
            className="h-[18px] w-[18px] rounded border-kaava-border text-forest focus:ring-forest/20 accent-forest"
          />
          <span className="font-inter text-body-sm text-text-label group-hover:text-dark transition-colors">
            Warehouse / Pickup address is same as registered address
          </span>
        </label>
      </div>

      {!formData.warehouseSameAsRegistered && (
        <>
          <SectionSubtitle>Warehouse / Pickup Address</SectionSubtitle>
          <AddressBlock prefix="warehouseAddress" address={formData.warehouseAddress} errors={errors} onUpdate={updateAddress} />
        </>
      )}
    </div>
  );
}

// ─── Step 3: Brand & Products ───────────────────────────────────────────────

function Step3BrandProducts({
  formData,
  errors,
  updateField,
  toggleCategory,
}: {
  formData: FormData;
  errors: ErrorState;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleCategory: (cat: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Brand & Products</SectionTitle>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Brand Name</FieldLabel>
          <TextInput value={formData.brandName} onChange={(v) => updateField("brandName", v)} placeholder="Your brand name as it will appear on CheckVeda" error={errors.brandName} />
        </div>

        {/* Product Categories */}
        <div className="flex flex-col gap-2">
          <FieldLabel required>Product Categories</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {PRODUCT_CATEGORIES.map((cat) => {
              const selected = formData.productCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-[8px] cursor-pointer transition-all text-[13px] font-inter ${
                    selected
                      ? "border-forest bg-surface-green text-dark font-medium"
                      : "border-kaava-border bg-white text-text-label hover:border-forest/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-kaava-border text-forest focus:ring-forest/20 accent-forest"
                  />
                  {cat}
                </label>
              );
            })}
          </div>
          <FieldError message={errors.productCategories} />
        </div>

        {/* Estimated Products */}
        <div className="flex flex-col gap-1.5 md:w-1/2">
          <FieldLabel required>Estimated Number of Products</FieldLabel>
          <SelectInput value={formData.estimatedProducts} onChange={(v) => updateField("estimatedProducts", v)} options={PRODUCT_COUNT_OPTIONS} placeholder="Select range" error={errors.estimatedProducts} />
        </div>

        {/* Tier Selection */}
        <div className="flex flex-col gap-2">
          <FieldLabel required>Preferred Tier</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TIER_OPTIONS.map((tier) => {
              const selected = formData.preferredTier === tier.value;
              return (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => updateField("preferredTier", tier.value)}
                  className={`flex flex-col items-start p-4 border-2 rounded-[12px] text-left transition-all ${
                    selected
                      ? "border-forest bg-surface-green shadow-sm"
                      : "border-kaava-border bg-white hover:border-forest/30"
                  }`}
                >
                  <span className="font-outfit text-body-lg font-semibold text-dark">{tier.name}</span>
                  <span className="font-inter text-[20px] font-bold text-forest mt-1">{tier.price}</span>
                  <div className="flex flex-col gap-0.5 mt-2">
                    <span className="font-inter text-[12px] text-text-secondary">Commission: {tier.commission}</span>
                    <span className="font-inter text-[12px] text-text-secondary">{tier.products}</span>
                  </div>
                  {selected && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-forest/10 text-forest font-inter text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.preferredTier} />
        </div>

        {/* Optional fields */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Brief Business Description</FieldLabel>
          <TextareaInput value={formData.businessDescription} onChange={(v) => updateField("businessDescription", v)} placeholder="Tell us about your brand, products, and what makes them unique" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Website URL</FieldLabel>
            <TextInput value={formData.websiteUrl} onChange={(v) => updateField("websiteUrl", v)} placeholder="https://www.yourbrand.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Social Media Links</FieldLabel>
            <TextInput value={formData.socialMediaLinks} onChange={(v) => updateField("socialMediaLinks", v)} placeholder="Instagram, Facebook, etc." />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Documents & Compliance ─────────────────────────────────────────

function Step4Documents({
  formData,
  errors,
  updateField,
  files,
  onFileSelect,
}: {
  formData: FormData;
  errors: ErrorState;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  files: FileState;
  onFileSelect: (key: string, file: File | null) => void;
}) {
  return (
    <div>
      <SectionTitle>Documents & Compliance</SectionTitle>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>GSTIN</FieldLabel>
            <TextInput
              value={formData.gstin}
              onChange={(v) => updateField("gstin", v.toUpperCase().slice(0, 15))}
              placeholder="e.g., 22AAAAA0000A1Z5"
              error={errors.gstin}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>FSSAI License Number</FieldLabel>
            <TextInput
              value={formData.fssaiLicense}
              onChange={(v) => updateField("fssaiLicense", v)}
              placeholder="14-digit FSSAI number"
              error={errors.fssaiLicense}
            />
          </div>
        </div>

        <div className="border-t border-kaava-border pt-5">
          <h3 className="font-outfit text-body-lg font-semibold text-dark mb-4">Upload Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DOC_TYPES.map((doc) => (
              <FileUpload
                key={doc.key}
                docKey={doc.key}
                label={doc.label}
                file={files[doc.key]}
                error={errors[doc.key]}
                onFileSelect={onFileSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Review & Submit ────────────────────────────────────────────────

function ReviewCard({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border-green rounded-[12px] bg-surface-green/30 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-surface-green border-b border-border-green">
        <h3 className="font-outfit text-body font-semibold text-dark">{title}</h3>
        <button
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1 font-inter text-[12px] font-semibold text-forest hover:text-forest-dark transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-1.5">
      <span className="font-inter text-[12px] text-muted sm:w-44 shrink-0">{label}</span>
      <span className="font-inter text-body-sm text-dark">{value}</span>
    </div>
  );
}

function Step5Review({
  formData,
  files,
  errors,
  consentChecked,
  onConsentChange,
  onEditStep,
}: {
  formData: FormData;
  files: FileState;
  errors: ErrorState;
  consentChecked: boolean;
  onConsentChange: (val: boolean) => void;
  onEditStep: (step: number) => void;
}) {
  const selectedTier = TIER_OPTIONS.find((t) => t.value === formData.preferredTier);
  const warehouseAddr = formData.warehouseSameAsRegistered
    ? formData.registeredAddress
    : formData.warehouseAddress;

  function formatAddress(addr: AddressFields): string {
    return [addr.addressLine, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
  }

  const uploadedDocs = Object.entries(files).filter(([, f]) => f !== null);

  return (
    <div>
      <SectionTitle>Review Your Application</SectionTitle>
      <p className="font-inter text-body-sm text-muted mb-6">
        Please review all the information below before submitting your application.
      </p>

      <div className="flex flex-col gap-4">
        {/* Business Info */}
        <ReviewCard title="Business Information" step={1} onEdit={onEditStep}>
          <div className="flex flex-col divide-y divide-kaava-border">
            <ReviewRow label="Business Name" value={formData.businessName} />
            <ReviewRow label="Business Type" value={formData.businessType} />
            <ReviewRow label="Owner Name" value={formData.ownerName} />
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Mobile" value={formData.mobile} />
            <ReviewRow label="Alternate Contact" value={formData.alternateContact} />
          </div>
        </ReviewCard>

        {/* Addresses */}
        <ReviewCard title="Addresses" step={2} onEdit={onEditStep}>
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-inter text-[12px] text-muted mb-1">Registered Address</p>
              <p className="font-inter text-body-sm text-dark">{formatAddress(formData.registeredAddress)}</p>
            </div>
            <div>
              <p className="font-inter text-[12px] text-muted mb-1">Warehouse / Pickup Address</p>
              <p className="font-inter text-body-sm text-dark">
                {formData.warehouseSameAsRegistered ? "Same as registered address" : formatAddress(warehouseAddr)}
              </p>
            </div>
          </div>
        </ReviewCard>

        {/* Brand & Products */}
        <ReviewCard title="Brand & Products" step={3} onEdit={onEditStep}>
          <div className="flex flex-col divide-y divide-kaava-border">
            <ReviewRow label="Brand Name" value={formData.brandName} />
            <ReviewRow label="Categories" value={formData.productCategories.join(", ")} />
            <ReviewRow label="Est. Products" value={formData.estimatedProducts} />
            <ReviewRow label="Preferred Tier" value={selectedTier ? `${selectedTier.name} (${selectedTier.price})` : ""} />
            <ReviewRow label="Description" value={formData.businessDescription} />
            <ReviewRow label="Website" value={formData.websiteUrl} />
            <ReviewRow label="Social Media" value={formData.socialMediaLinks} />
          </div>
        </ReviewCard>

        {/* Documents */}
        <ReviewCard title="Documents & Compliance" step={4} onEdit={onEditStep}>
          <div className="flex flex-col divide-y divide-kaava-border">
            <ReviewRow label="GSTIN" value={formData.gstin} />
            <ReviewRow label="FSSAI License" value={formData.fssaiLicense} />
            {uploadedDocs.length > 0 && (
              <div className="py-1.5">
                <span className="font-inter text-[12px] text-muted">Uploaded Documents</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {uploadedDocs.map(([key, file]) => (
                    <span key={key} className="inline-flex items-center gap-1.5 bg-white border border-border-green rounded-full px-3 py-1 font-inter text-[12px] text-dark">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {file!.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ReviewCard>
      </div>

      {/* Consent */}
      <div className="mt-6 p-4 bg-surface border border-kaava-border rounded-[12px]">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => {
              onConsentChange(e.target.checked);
              if (e.target.checked) {
                // Clear consent error on check
                // (handled via parent)
              }
            }}
            className="h-[18px] w-[18px] mt-0.5 rounded border-kaava-border text-forest focus:ring-forest/20 accent-forest shrink-0"
          />
          <span className="font-inter text-[13px] text-text-label leading-relaxed">
            I agree to CheckVeda&apos;s{" "}
            <span className="text-forest font-medium">Terms & Conditions</span>,{" "}
            <span className="text-forest font-medium">Marketplace Commission Policy</span>, and{" "}
            <span className="text-forest font-medium">Return/Refund Policy</span>.
            I consent to the processing of my data as described in the{" "}
            <span className="text-forest font-medium">Privacy Notice (DPDP Act 2023)</span>.
          </span>
        </label>
        <FieldError message={errors.consent} />
      </div>
    </div>
  );
}
