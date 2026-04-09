"use client";
// ─── app/vendor-onboarding/page.tsx ─────────────────────────────────────────
//
// Multi-step vendor onboarding form for CheckVeda marketplace.
// Standalone page — no cart/wishlist/auth context dependencies.
// 5 steps: Business Info -> Addresses -> Brand & Products -> Documents -> Review
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Upload, FileText, X, Pencil, Loader2, Plus, Trash2 } from "lucide-react";

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

const PRODUCT_TYPES = ["Herbal Medicine", "Organic Food", "Both"] as const;

const HERBAL_CATEGORIES = [
  "Hair Care", "Skin Care", "Body Care", "Oral Care",
  "Immunity & Wellness", "Digestive Health", "Women's Health", "Men's Health",
  "Eye Care", "Aromatherapy", "Baby Care", "Other",
] as const;

const ORGANIC_CATEGORIES = [
  "Ghee & Dairy", "Flours & Atta", "Rice & Grains", "Cold-Pressed Oils",
  "Spices & Masala", "Honey & Sweeteners", "Pulses & Lentils", "Dry Fruits & Nuts",
  "Organic Snacks", "Beverages", "Other",
] as const;

function getCategories(productType: string): readonly string[] {
  if (productType === "Herbal Medicine") return HERBAL_CATEGORIES;
  if (productType === "Organic Food") return ORGANIC_CATEGORIES;
  if (productType === "Both") return [...new Set([...HERBAL_CATEGORIES, ...ORGANIC_CATEGORIES])];
  return [];
}

const PRODUCT_COUNT_OPTIONS = ["1-3", "4-10", "11-50", "51-100", "100+"] as const;

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
  productType: string;
  productCategories: string[];
  otherCategory: string;
  estimatedProducts: string;
  businessDescription: string;
  websiteUrl: string;
  socialMediaLinks: string[];
  // Step 4
  gstin: string;
  fssaiLicense: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountType: string;
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
  productType: "",
  productCategories: [],
  otherCategory: "",
  estimatedProducts: "",
  businessDescription: "",
  websiteUrl: "",
  socialMediaLinks: [""],
  gstin: "",
  fssaiLicense: "",
  accountHolderName: "",
  bankName: "",
  branchName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  accountType: "",
};

// ─── Dev Test Data ───────────────────────────────────────────────────────────

const TEST_DATA_SUCCESS: FormData = {
  businessName: "Veda Organics Pvt. Ltd.",
  businessType: "Private Limited Company",
  ownerName: "Robin Kumar",
  email: "robin@vedaorganics.com",
  mobile: "9876543210",
  alternateContact: "9123456780",
  registeredAddress: { addressLine: "Ward No.2, Plot 3, Street 2, Near Canara Bank", city: "Chandigarh", state: "Chandigarh", pincode: "140101" },
  warehouseSameAsRegistered: true,
  warehouseAddress: { addressLine: "", city: "", state: "", pincode: "" },
  brandName: "Veda Organics",
  productType: "Both",
  productCategories: ["Hair Care", "Skin Care", "Ghee & Dairy", "Cold-Pressed Oils"],
  otherCategory: "",
  estimatedProducts: "11-50",
  businessDescription: "Premium Ayurvedic and organic products sourced from Himalayan farms.",
  websiteUrl: "https://vedaorganics.com",
  socialMediaLinks: ["https://instagram.com/vedaorganics", "https://facebook.com/vedaorganics"],
  gstin: "22AAAAA0000A1Z5",
  fssaiLicense: "10012345678901",
  accountHolderName: "Veda Organics Pvt Ltd",
  bankName: "State Bank of India",
  branchName: "HAJIGANJ",
  accountNumber: "123456789012",
  confirmAccountNumber: "123456789012",
  ifscCode: "SBIN0001234",
  accountType: "Current",
};

const TEST_DATA_MINIMAL: FormData = {
  businessName: "Test Herbs",
  businessType: "Sole Proprietorship",
  ownerName: "Test User",
  email: "test@herbs.com",
  mobile: "9000000001",
  alternateContact: "",
  registeredAddress: { addressLine: "123 Test Road", city: "Delhi", state: "Delhi", pincode: "110001" },
  warehouseSameAsRegistered: true,
  warehouseAddress: { addressLine: "", city: "", state: "", pincode: "" },
  brandName: "Test Herbs",
  productType: "Herbal Medicine",
  productCategories: ["Skin Care"],
  otherCategory: "",
  estimatedProducts: "1-3",
  businessDescription: "",
  websiteUrl: "",
  socialMediaLinks: [""],
  gstin: "",
  fssaiLicense: "",
  accountHolderName: "Test User",
  bankName: "HDFC Bank",
  branchName: "FORT",
  accountNumber: "50100123456789",
  confirmAccountNumber: "50100123456789",
  ifscCode: "HDFC0000001",
  accountType: "Savings",
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
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [editingFromReview, setEditingFromReview] = useState(false);

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
      if (!formData.productType) newErrors.productType = "Select a product type";
      if (formData.productCategories.length === 0) newErrors.productCategories = "Select at least one category";
      if (formData.productCategories.includes("Other") && !formData.otherCategory.trim()) {
        newErrors.otherCategory = "Please specify your category";
      }
      if (!formData.estimatedProducts) newErrors.estimatedProducts = "Select estimated number of products";
    }

    if (step === 4) {
      if (formData.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(formData.gstin.toUpperCase())) {
        newErrors.gstin = "Enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)";
      }
      // Bank details validation
      if (!formData.accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required";
      if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = "Enter a valid account number (9-18 digits)";
      }
      if (!formData.confirmAccountNumber.trim()) {
        newErrors.confirmAccountNumber = "Please confirm your account number";
      } else if (formData.accountNumber !== formData.confirmAccountNumber) {
        newErrors.confirmAccountNumber = "Account numbers do not match";
      }
      if (!formData.ifscCode.trim()) {
        newErrors.ifscCode = "IFSC code is required";
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
        newErrors.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
      }
      if (!formData.accountType) newErrors.accountType = "Select account type";
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
      if (currentStep === 5) setEditingFromReview(true);
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function backToReview() {
    setEditingFromReview(false);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        _website_confirm: honeypot,
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
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 bg-forest text-white font-inter text-body font-semibold rounded-lg hover:bg-forest-dark transition-colors"
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
        <h1 className="font-outfit text-page-title font-bold text-dark text-center mb-2">Vendor Onboarding</h1>
        <p className="font-inter text-sm text-text-secondary text-center mb-6">Join CheckVeda&apos;s trusted marketplace of verified Ayurvedic &amp; organic brands</p>
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

          {/* Honeypot — invisible to humans, bots auto-fill it */}
          <div aria-hidden="true" className="absolute opacity-0 -z-10 h-0 overflow-hidden">
            <label htmlFor="website_confirm">Leave this empty</label>
            <input
              id="website_confirm"
              name="website_confirm"
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

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
                  <div className="flex items-center gap-3">
                    {editingFromReview && (
                      <Button
                        variant="outline"
                        onClick={backToReview}
                        className="h-10 px-5 gap-2 font-inter text-sm font-semibold border-forest text-forest hover:bg-surface-green"
                      >
                        Back to Review
                      </Button>
                    )}
                    <Button
                      onClick={goNext}
                      className="h-10 px-7 gap-2 bg-forest text-white hover:bg-forest-dark font-inter text-sm font-semibold"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
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

      {/* Dev toolbar — only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-dark/95 text-white rounded-xl p-3 shadow-lg font-inter text-xs max-w-[200px]">
          <span className="font-semibold text-[11px] text-white/60 uppercase tracking-wide">Dev Tools</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStep(s)}
                className={`w-7 h-7 rounded-md font-semibold transition-colors ${
                  currentStep === s ? "bg-forest text-white" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setFormData(TEST_DATA_SUCCESS); setConsentChecked(true); }}
            className="bg-forest/80 hover:bg-forest px-2 py-1.5 rounded-md text-left transition-colors"
          >
            Fill: Full Success
          </button>
          <button
            onClick={() => { setFormData(TEST_DATA_MINIMAL); setConsentChecked(true); }}
            className="bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-md text-left transition-colors"
          >
            Fill: Minimal
          </button>
          <button
            onClick={() => { setFormData(initialFormData); setFiles({ gstCertificate: null, fssaiCertificate: null, trademarkCertificate: null, brandAuthorizationLetter: null }); setErrors({}); setConsentChecked(false); setSubmitError(""); }}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1.5 rounded-md text-left transition-colors"
          >
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Header ─────────────────────────────────────────────────────────────────

function OnboardingHeader() {
  return (
    <header className="w-full bg-forest-dark" style={{ height: 90, paddingBottom: 15 }}>
      <div className="content-container flex items-center justify-center h-full">
        <Link href="/" className="flex items-center">
          <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
        </Link>
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
      <Select value={value} onValueChange={(v) => { if (v !== null) onChange(v); }}>
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
  const hasOther = formData.productCategories.includes("Other");
  const socialLinks = Array.isArray(formData.socialMediaLinks) ? formData.socialMediaLinks : [""];
  const availableCategories = getCategories(formData.productType);

  function updateSocialLink(index: number, value: string) {
    const updated = [...socialLinks];
    updated[index] = value;
    updateField("socialMediaLinks", updated);
  }

  function addSocialLink() {
    if (socialLinks.length < 4) {
      updateField("socialMediaLinks", [...socialLinks, ""]);
    }
  }

  function removeSocialLink(index: number) {
    const updated = socialLinks.filter((_, i) => i !== index);
    updateField("socialMediaLinks", updated.length === 0 ? [""] : updated);
  }

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
          <FieldLabel required>Product Type</FieldLabel>
          <div className="flex flex-wrap gap-3">
            {PRODUCT_TYPES.map((type) => {
              const selected = formData.productType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    updateField("productType", type);
                    // Clear categories that don't belong to the new type
                    const newCats = getCategories(type);
                    const filtered = formData.productCategories.filter((c) => newCats.includes(c));
                    updateField("productCategories", filtered);
                  }}
                  className={`px-5 py-2.5 rounded-lg font-inter text-sm font-medium border-2 transition-all ${
                    selected
                      ? "border-forest bg-surface-green text-dark"
                      : "border-divider bg-white text-text-label hover:border-forest/30"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.productType} />
        </div>

        {formData.productType && (
        <div className="flex flex-col gap-2">
          <FieldLabel required>Product Categories</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {availableCategories.map((cat) => {
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

          {hasOther && (
            <div className="flex flex-col gap-1.5 mt-2">
              <FieldLabel required>Please specify your category</FieldLabel>
              <FormInput
                value={formData.otherCategory}
                onChange={(v) => updateField("otherCategory", v)}
                placeholder="e.g., Pet Wellness, Sports Nutrition"
                error={errors.otherCategory}
              />
            </div>
          )}
        </div>
        )}

        <div className="flex flex-col gap-1.5 md:w-1/2">
          <FieldLabel required>Estimated Number of Products</FieldLabel>
          <FormSelect value={formData.estimatedProducts} onChange={(v) => updateField("estimatedProducts", v)} options={PRODUCT_COUNT_OPTIONS} placeholder="Select range" error={errors.estimatedProducts} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Brief Business Description</FieldLabel>
          <FormTextarea value={formData.businessDescription} onChange={(v) => updateField("businessDescription", v)} placeholder="Tell us about your brand, products, and what makes them unique" rows={3} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Website URL</FieldLabel>
          <FormInput value={formData.websiteUrl} onChange={(v) => updateField("websiteUrl", v)} placeholder="https://www.yourbrand.com" />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>Social Media Links</FieldLabel>
          <div className="flex flex-col gap-2.5">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={link}
                  onChange={(e) => updateSocialLink(index, e.target.value)}
                  placeholder={index === 0 ? "https://instagram.com/yourbrand" : "https://..."}
                  className="h-10 px-3.5 font-inter text-sm text-dark placeholder:text-placeholder flex-1"
                />
                {socialLinks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                    className="shrink-0 text-muted hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {socialLinks.length < 4 && (
            <button
              type="button"
              onClick={addSocialLink}
              className="inline-flex items-center gap-1.5 font-inter text-[13px] font-medium text-forest hover:text-forest-dark transition-colors self-start mt-1"
            >
              <Plus className="w-4 h-4" />
              Add another link
            </button>
          )}
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
  const [ifscLookup, setIfscLookup] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function lookupIfsc(code: string) {
    updateField("ifscCode", code.toUpperCase().slice(0, 11));
    if (code.length !== 11) {
      setIfscLookup("idle");
      updateField("bankName", "");
      updateField("branchName", "");
      return;
    }
    setIfscLookup("loading");
    try {
      const res = await fetch(`/api/ifsc/${code.toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        updateField("bankName", data.BANK || "");
        updateField("branchName", data.BRANCH || "");
        setIfscLookup("success");
      } else {
        setIfscLookup("error");
        updateField("bankName", "");
        updateField("branchName", "");
      }
    } catch {
      setIfscLookup("error");
      updateField("bankName", "");
      updateField("branchName", "");
    }
  }

  return (
    <div>
      <SectionTitle>Documents & Compliance</SectionTitle>
      <p className="font-inter text-sm text-text-secondary mb-5 -mt-2">
        Upload your business documents and bank details for verification and payouts.
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

        <Separator />

        <div>
          <h3 className="font-outfit text-body-lg font-semibold text-dark mb-1">Bank Account Details</h3>
          <p className="font-inter text-[13px] text-text-secondary mb-4">Required for processing vendor payouts. Your details are stored securely.</p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Account Holder Name</FieldLabel>
              <FormInput
                value={formData.accountHolderName}
                onChange={(v) => updateField("accountHolderName", v)}
                placeholder="As per bank records"
                error={errors.accountHolderName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Account Number</FieldLabel>
                <FormInput
                  value={formData.accountNumber}
                  onChange={(v) => updateField("accountNumber", v.replace(/\D/g, "").slice(0, 18))}
                  placeholder="9 to 18 digit account number"
                  error={errors.accountNumber}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Confirm Account Number</FieldLabel>
                <FormInput
                  value={formData.confirmAccountNumber}
                  onChange={(v) => updateField("confirmAccountNumber", v.replace(/\D/g, "").slice(0, 18))}
                  placeholder="Re-enter account number"
                  error={errors.confirmAccountNumber}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>IFSC Code</FieldLabel>
                <div className="relative">
                  <Input
                    value={formData.ifscCode}
                    onChange={(e) => lookupIfsc(e.target.value)}
                    placeholder="e.g., SBIN0001234"
                    aria-invalid={!!errors.ifscCode}
                    className="h-10 px-3.5 font-inter text-sm text-dark placeholder:text-placeholder pr-10"
                  />
                  {ifscLookup === "loading" && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted animate-spin" />
                  )}
                  {ifscLookup === "success" && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest" />
                  )}
                </div>
                <FieldError message={errors.ifscCode} />
                {ifscLookup === "error" && formData.ifscCode.length === 11 && (
                  <p className="font-inter text-[12px] text-red-500 mt-0.5">Invalid IFSC code — please check and re-enter</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Bank Name</FieldLabel>
                <Input
                  value={formData.bankName}
                  readOnly
                  placeholder={ifscLookup === "loading" ? "Looking up..." : "Auto-filled from IFSC"}
                  className="h-10 px-3.5 font-inter text-sm text-dark placeholder:text-placeholder bg-surface cursor-default"
                />
                <FieldError message={errors.bankName} />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Branch</FieldLabel>
                <Input
                  value={formData.branchName}
                  readOnly
                  placeholder={ifscLookup === "loading" ? "Looking up..." : "Auto-filled from IFSC"}
                  className="h-10 px-3.5 font-inter text-sm text-dark placeholder:text-placeholder bg-surface cursor-default"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:w-1/2">
              <FieldLabel required>Account Type</FieldLabel>
              <FormSelect
                value={formData.accountType}
                onChange={(v) => updateField("accountType", v)}
                options={["Savings", "Current"]}
                placeholder="Select account type"
                error={errors.accountType}
              />
            </div>
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
    <div className="rounded-xl ring-1 ring-border-green overflow-hidden bg-white">
      <div className="flex items-center justify-between px-5 py-3 bg-surface-green border-b border-border-green">
        <h3 className="font-outfit text-body font-semibold text-dark">{title}</h3>
        <button
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1.5 font-inter text-[13px] font-semibold text-forest hover:text-forest-dark transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
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
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2">
      <span className="font-inter text-[13px] font-medium text-text-secondary sm:w-44 shrink-0">{label}</span>
      <span className="font-inter text-sm font-medium text-dark">{value}</span>
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
            <ReviewRow label="Product Type" value={formData.productType} />
            <ReviewRow label="Categories" value={
              formData.productCategories
                .map((c) => c === "Other" && formData.otherCategory ? `Other (${formData.otherCategory})` : c)
                .join(", ")
            } />
            <ReviewRow label="Est. Products" value={formData.estimatedProducts} />
            <ReviewRow label="Description" value={formData.businessDescription} />
            <ReviewRow label="Website" value={formData.websiteUrl} />
            <ReviewRow label="Social Media" value={(Array.isArray(formData.socialMediaLinks) ? formData.socialMediaLinks : []).filter(Boolean).join(", ")} />
          </div>
        </ReviewCard>

        <ReviewCard title="Documents & Compliance" step={4} onEdit={onEditStep}>
          <div className="flex flex-col divide-y divide-divider">
            <ReviewRow label="GSTIN" value={formData.gstin} />
            <ReviewRow label="FSSAI License" value={formData.fssaiLicense} />
            {uploadedDocs.length > 0 && (
              <div className="py-2">
                <span className="font-inter text-[13px] font-medium text-text-secondary">Uploaded Documents</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedDocs.map(([key, file]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        const url = URL.createObjectURL(file!);
                        window.open(url, "_blank");
                      }}
                      className="inline-flex items-center gap-1.5 bg-white border border-border-green rounded-full px-3 py-1.5 font-inter text-[12px] text-dark hover:bg-surface-green hover:border-forest/30 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-forest" />
                      {file!.name}
                      <span className="text-[10px] text-forest font-medium ml-0.5">Preview</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <ReviewRow label="Account Holder" value={formData.accountHolderName} />
            <ReviewRow label="Bank Name" value={formData.bankName} />
            <ReviewRow label="Branch" value={formData.branchName} />
            <ReviewRow label="Account Number" value={formData.accountNumber ? `****${formData.accountNumber.slice(-4)}` : ""} />
            <ReviewRow label="IFSC Code" value={formData.ifscCode} />
            <ReviewRow label="Account Type" value={formData.accountType} />
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
            <Link href="/policies/terms" target="_blank" className="text-forest font-medium underline underline-offset-2 hover:text-forest-dark">Terms &amp; Conditions</Link>,{" "}
            <Link href="/policies/commission" target="_blank" className="text-forest font-medium underline underline-offset-2 hover:text-forest-dark">Marketplace Commission Policy</Link>, and{" "}
            <Link href="/policies/returns" target="_blank" className="text-forest font-medium underline underline-offset-2 hover:text-forest-dark">Return/Refund Policy</Link>.
            I consent to the processing of my data as described in the{" "}
            <Link href="/policies/privacy" target="_blank" className="text-forest font-medium underline underline-offset-2 hover:text-forest-dark">Privacy Notice (DPDP Act 2023)</Link>.
          </span>
        </label>
        <FieldError message={errors.consent} />
      </div>
    </div>
  );
}
