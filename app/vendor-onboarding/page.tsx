"use client";
// ─── app/vendor-onboarding/page.tsx ─────────────────────────────────────────
//
// Multi-step vendor onboarding form for CheckVeda marketplace.
// Standalone page — no cart/wishlist/auth context dependencies.
// 5 steps: Business Info -> Addresses -> Brand & Products -> Documents -> Review
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Upload, FileText, X, Pencil, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");
    setErrors({});

    try {
      // Upload files first
      const uploadedFiles: Record<string, string> = {};
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const fd = new globalThis.FormData();
          fd.append("file", file);
          fd.append("type", key);
          const uploadRes = await fetch("/api/vendor/upload", { method: "POST", body: fd });
          if (!uploadRes.ok) {
            setSubmitError(`Failed to upload ${key.replace(/([A-Z])/g, " $1").toLowerCase()}. Please try again.`);
            setIsSubmitting(false);
            return;
          }
          const data = await uploadRes.json();
          uploadedFiles[key] = data.url || data.filename;
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
        // Handle server validation errors
        try {
          const errorData = await res.json();
          if (errorData.errors && typeof errorData.errors === "object") {
            // Per-field errors from server
            setErrors(errorData.errors);
            if (errorData.step) {
              setCurrentStep(errorData.step);
            }
          }
          setSubmitError(errorData.message || "Submission failed. Please check your information and try again.");
        } catch {
          setSubmitError("Submission failed. Please try again later.");
        }
      }
    } catch {
      setSubmitError("Could not connect to the server. Please check your internet connection and try again.");
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
            <Check className="w-10 h-10 text-forest" strokeWidth={2.5} />
          </div>
          <h1 className="font-outfit text-section-title font-bold text-dark mb-3">
            Application Submitted Successfully!
          </h1>
          <p className="font-inter text-body text-text-secondary max-w-lg mb-6">
            Your vendor application has been received. Our team will review your details and get back to you within 3-5 business days.
          </p>
          <Card className="mb-8">
            <CardContent className="text-center">
              <p className="font-inter text-body-sm text-muted mb-1">Application ID</p>
              <p className="font-inter text-body-lg font-semibold text-dark font-mono tracking-wide">{applicationId}</p>
            </CardContent>
          </Card>
          <Button asChild className="h-12 px-8 bg-forest text-white hover:bg-forest-dark font-inter text-body font-semibold">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface">
      <OnboardingHeader />

      <div className="content-container py-8">
        <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

        <div className="max-w-3xl mx-auto mt-8">
          {submitError && (
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="flex-1">
                <p className="font-inter text-sm font-medium text-red-800">{submitError}</p>
                <p className="font-inter text-xs text-red-600 mt-0.5">Your information has been preserved. Fix any issues and try again.</p>
              </div>
              <button onClick={() => setSubmitError("")} className="shrink-0 text-red-400 hover:text-red-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <Card className="shadow-card border-0 ring-0">
            <CardContent className="p-6 sm:p-8 md:p-10">
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

              <Separator className="mt-8 mb-6" />

              <div className="flex items-center justify-between">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    onClick={goBack}
                    className="h-10 px-5 gap-2 font-inter text-sm font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <Button
                    onClick={goNext}
                    className="h-10 px-7 gap-2 bg-forest text-white hover:bg-forest-dark font-inter text-sm font-semibold"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-10 px-7 gap-2 bg-forest text-white hover:bg-forest-dark font-inter text-sm font-semibold disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
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
    <div className="flex items-start justify-center overflow-x-auto scrollbar-hide py-2">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-start">
            {index > 0 && (
              <div
                className="hidden sm:block mt-[15px]"
                style={{ width: 40 }}
              >
                <div
                  className="h-[2px] w-full rounded-full transition-colors"
                  style={{
                    backgroundColor: isCompleted || isActive ? "#2D6A4F" : "#E0E0E0",
                  }}
                />
              </div>
            )}
            {index > 0 && (
              <div
                className="sm:hidden mt-[15px]"
                style={{ width: 16 }}
              >
                <div
                  className="h-[2px] w-full rounded-full transition-colors"
                  style={{
                    backgroundColor: isCompleted || isActive ? "#2D6A4F" : "#E0E0E0",
                  }}
                />
              </div>
            )}

            <div className="flex flex-col items-center gap-1.5" style={{ width: 80 }}>
              <button
                onClick={() => {
                  if (isCompleted) onStepClick(step.id);
                }}
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full font-inter text-[13px] font-semibold transition-all ${
                  isCompleted
                    ? "bg-forest text-white cursor-pointer hover:bg-forest-dark"
                    : isActive
                      ? "bg-forest text-white ring-4 ring-forest/20"
                      : "bg-divider text-muted cursor-default"
                }`}
                aria-label={`Step ${step.id}: ${step.label}`}
                disabled={!isCompleted}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  step.id
                )}
              </button>
              <span
                className={`font-inter text-[11px] sm:text-[12px] whitespace-nowrap text-center ${
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
    <Label className="font-inter text-[13px] font-medium text-text-label">
      {children}{required && <span className="text-saffron ml-0.5">*</span>}
    </Label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="font-inter text-[12px] text-red-500 mt-1">{message}</p>;
}

function FormInput({
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
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className="h-10 px-3.5 font-inter text-sm text-dark placeholder:text-placeholder"
      />
      <FieldError message={error} />
    </>
  );
}

function FormSelect({
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
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="w-full !h-10 px-3.5 font-inter text-sm"
          aria-invalid={!!error}
        >
          <SelectValue placeholder={placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError message={error} />
    </>
  );
}

function FormTextarea({
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
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={!!error}
        className="px-3.5 py-3 font-inter text-sm text-dark placeholder:text-placeholder resize-none"
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
    <h3 className="font-outfit text-body-lg font-semibold text-dark mb-4 mt-6 pb-2 border-b border-divider">{children}</h3>
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
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-green border border-border-green rounded-lg">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-[18px] h-[18px] text-forest shrink-0" />
            <span className="font-inter text-sm text-dark truncate">{file.name}</span>
            <span className="font-inter text-[11px] text-muted shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
          </div>
          <button
            onClick={() => onFileSelect(docKey, null)}
            className="shrink-0 p-1 text-muted hover:text-red-500 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "border-forest bg-forest/5"
              : error
                ? "border-red-300 bg-red-50/50"
                : "border-divider hover:border-forest/40 hover:bg-surface-green/50"
          }`}
        >
          <Upload className="w-6 h-6 text-muted" strokeWidth={1.5} />
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
      <p className="font-inter text-sm text-text-secondary mb-5 -mt-2">
        Help us verify your business. This information will be used for invoicing and communication.
      </p>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Business / Company Name</FieldLabel>
            <FormInput value={formData.businessName} onChange={(v) => updateField("businessName", v)} placeholder="e.g., Kaava Naturals Pvt. Ltd." error={errors.businessName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Business Type</FieldLabel>
            <FormSelect value={formData.businessType} onChange={(v) => updateField("businessType", v)} options={BUSINESS_TYPES} placeholder="Select business type" error={errors.businessType} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Owner / Authorized Person Name</FieldLabel>
          <FormInput value={formData.ownerName} onChange={(v) => updateField("ownerName", v)} placeholder="Full name of the authorized person" error={errors.ownerName} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Email Address</FieldLabel>
            <FormInput value={formData.email} onChange={(v) => updateField("email", v)} placeholder="business@example.com" type="email" error={errors.email} />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Mobile Number</FieldLabel>
            <FormInput value={formData.mobile} onChange={(v) => updateField("mobile", v.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" error={errors.mobile} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:w-1/2">
          <FieldLabel>Alternate Contact Number</FieldLabel>
          <FormInput value={formData.alternateContact} onChange={(v) => updateField("alternateContact", v.replace(/\D/g, "").slice(0, 10))} placeholder="Optional" error={errors.alternateContact} />
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
        <FormTextarea value={address.addressLine} onChange={(v) => onUpdate(prefix, "addressLine", v)} placeholder="Building, Street, Area" rows={2} error={errors[`${prefix}.addressLine`]} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>City</FieldLabel>
          <FormInput value={address.city} onChange={(v) => onUpdate(prefix, "city", v)} placeholder="City" error={errors[`${prefix}.city`]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>State</FieldLabel>
          <FormSelect value={address.state} onChange={(v) => onUpdate(prefix, "state", v)} options={INDIAN_STATES} placeholder="Select state" error={errors[`${prefix}.state`]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Pincode</FieldLabel>
          <FormInput value={address.pincode} onChange={(v) => onUpdate(prefix, "pincode", v.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pincode" error={errors[`${prefix}.pincode`]} />
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
      <p className="font-inter text-sm text-text-secondary mb-5 -mt-2">
        We need your registered and warehouse addresses for shipping logistics and GST compliance.
      </p>

      <SectionSubtitle>Registered Business Address</SectionSubtitle>
      <AddressBlock prefix="registeredAddress" address={formData.registeredAddress} errors={errors} onUpdate={updateAddress} />

      <div className="mt-6 mb-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={formData.warehouseSameAsRegistered}
            onCheckedChange={(checked) => updateField("warehouseSameAsRegistered", checked === true)}
            className="data-checked:bg-forest data-checked:border-forest"
          />
          <span className="font-inter text-sm text-text-label group-hover:text-dark transition-colors">
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
      <p className="font-inter text-sm text-text-secondary mb-5 -mt-2">
        Tell us about your brand and product range so we can set up your store correctly.
      </p>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Brand Name</FieldLabel>
          <FormInput value={formData.brandName} onChange={(v) => updateField("brandName", v)} placeholder="Your brand name as it will appear on CheckVeda" error={errors.brandName} />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel required>Product Categories</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {PRODUCT_CATEGORIES.map((cat) => {
              const selected = formData.productCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer transition-all text-[13px] font-inter ${
                    selected
                      ? "border-forest bg-surface-green text-dark font-medium"
                      : "border-divider bg-white text-text-label hover:border-forest/30"
                  }`}
                >
                  <Checkbox
                    checked={selected}
                    onCheckedChange={() => toggleCategory(cat)}
                    className="data-checked:bg-forest data-checked:border-forest"
                  />
                  {cat}
                </label>
              );
            })}
          </div>
          <FieldError message={errors.productCategories} />
        </div>

        <div className="flex flex-col gap-1.5 md:w-1/2">
          <FieldLabel required>Estimated Number of Products</FieldLabel>
          <FormSelect value={formData.estimatedProducts} onChange={(v) => updateField("estimatedProducts", v)} options={PRODUCT_COUNT_OPTIONS} placeholder="Select range" error={errors.estimatedProducts} />
        </div>

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
                  className={`flex flex-col items-start p-4 border-2 rounded-xl text-left transition-all ${
                    selected
                      ? "border-forest bg-surface-green shadow-sm"
                      : "border-divider bg-white hover:border-forest/30"
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
                      <Check className="w-3 h-3" strokeWidth={3} />
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.preferredTier} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Brief Business Description</FieldLabel>
          <FormTextarea value={formData.businessDescription} onChange={(v) => updateField("businessDescription", v)} placeholder="Tell us about your brand, products, and what makes them unique" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Website URL</FieldLabel>
            <FormInput value={formData.websiteUrl} onChange={(v) => updateField("websiteUrl", v)} placeholder="https://www.yourbrand.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Social Media Links</FieldLabel>
            <FormInput value={formData.socialMediaLinks} onChange={(v) => updateField("socialMediaLinks", v)} placeholder="Instagram, Facebook, etc." />
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
      <p className="font-inter text-sm text-text-secondary mb-5 -mt-2">
        Upload your business documents for verification. GSTIN and FSSAI details help us ensure marketplace compliance.
      </p>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>GSTIN</FieldLabel>
            <FormInput
              value={formData.gstin}
              onChange={(v) => updateField("gstin", v.toUpperCase().slice(0, 15))}
              placeholder="e.g., 22AAAAA0000A1Z5"
              error={errors.gstin}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>FSSAI License Number</FieldLabel>
            <FormInput
              value={formData.fssaiLicense}
              onChange={(v) => updateField("fssaiLicense", v)}
              placeholder="14-digit FSSAI number"
              error={errors.fssaiLicense}
            />
          </div>
        </div>

        <Separator />

        <div>
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
    <Card className="border-0 ring-1 ring-border-green overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-surface-green border-b border-border-green">
        <h3 className="font-outfit text-body font-semibold text-dark">{title}</h3>
        <button
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1 font-inter text-[12px] font-semibold text-forest hover:text-forest-dark transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
      <CardContent className="px-5 py-4">{children}</CardContent>
    </Card>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-1.5">
      <span className="font-inter text-[12px] text-muted sm:w-44 shrink-0">{label}</span>
      <span className="font-inter text-sm text-dark">{value}</span>
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
      <p className="font-inter text-sm text-muted mb-6">
        Please review all the information below before submitting your application.
      </p>

      <div className="flex flex-col gap-4">
        <ReviewCard title="Business Information" step={1} onEdit={onEditStep}>
          <div className="flex flex-col divide-y divide-divider">
            <ReviewRow label="Business Name" value={formData.businessName} />
            <ReviewRow label="Business Type" value={formData.businessType} />
            <ReviewRow label="Owner Name" value={formData.ownerName} />
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Mobile" value={formData.mobile} />
            <ReviewRow label="Alternate Contact" value={formData.alternateContact} />
          </div>
        </ReviewCard>

        <ReviewCard title="Addresses" step={2} onEdit={onEditStep}>
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-inter text-[12px] text-muted mb-1">Registered Address</p>
              <p className="font-inter text-sm text-dark">{formatAddress(formData.registeredAddress)}</p>
            </div>
            <div>
              <p className="font-inter text-[12px] text-muted mb-1">Warehouse / Pickup Address</p>
              <p className="font-inter text-sm text-dark">
                {formData.warehouseSameAsRegistered ? "Same as registered address" : formatAddress(warehouseAddr)}
              </p>
            </div>
          </div>
        </ReviewCard>

        <ReviewCard title="Brand & Products" step={3} onEdit={onEditStep}>
          <div className="flex flex-col divide-y divide-divider">
            <ReviewRow label="Brand Name" value={formData.brandName} />
            <ReviewRow label="Categories" value={formData.productCategories.join(", ")} />
            <ReviewRow label="Est. Products" value={formData.estimatedProducts} />
            <ReviewRow label="Preferred Tier" value={selectedTier ? `${selectedTier.name} (${selectedTier.price})` : ""} />
            <ReviewRow label="Description" value={formData.businessDescription} />
            <ReviewRow label="Website" value={formData.websiteUrl} />
            <ReviewRow label="Social Media" value={formData.socialMediaLinks} />
          </div>
        </ReviewCard>

        <ReviewCard title="Documents & Compliance" step={4} onEdit={onEditStep}>
          <div className="flex flex-col divide-y divide-divider">
            <ReviewRow label="GSTIN" value={formData.gstin} />
            <ReviewRow label="FSSAI License" value={formData.fssaiLicense} />
            {uploadedDocs.length > 0 && (
              <div className="py-1.5">
                <span className="font-inter text-[12px] text-muted">Uploaded Documents</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {uploadedDocs.map(([key, file]) => (
                    <span key={key} className="inline-flex items-center gap-1.5 bg-white border border-border-green rounded-full px-3 py-1 font-inter text-[12px] text-dark">
                      <FileText className="w-3 h-3 text-forest" />
                      {file!.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ReviewCard>
      </div>

      <div className="mt-6 p-4 bg-surface rounded-xl ring-1 ring-foreground/10">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={consentChecked}
            onCheckedChange={(checked) => onConsentChange(checked === true)}
            className="mt-0.5 data-checked:bg-forest data-checked:border-forest"
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
