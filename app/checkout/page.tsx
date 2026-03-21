"use client";
// ─── app/checkout/page.tsx ────────────────────────────────────────────────────
//
// Checkout page (/checkout).
// Layout: Simplified checkout header + Step indicator + Form + Order Summary
// Client component — reads cart state via useCart().
// MVP: UI only, no real payment processing.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { getProductImage } from "@/lib/images";

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;

// Step definitions
const STEPS = [
  { id: 1, label: "Address" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
] as const;

type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export default function CheckoutPage() {
  const { state, totalItems, totalPrice } = useCart();
  const { items } = state;

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");

  // Address form state
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    address1: "",
    address2: "",
    city: "",
    stateRegion: "",
  });

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = totalPrice + shipping;

  function handleAddressChange(field: string, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  // ─── Checkout Header ─────────────────────────────────────────────────────────
  function CheckoutHeader() {
    return (
      <header
        className="w-full bg-forest"
        style={{ height: 72 }}
      >
        <div
          className="content-container flex items-center justify-between h-full"
        >
          <Link href="/" className="font-devanagari text-white text-[24px] font-bold no-underline">
            &#2325;&#2366;&#2357;&#2366;
          </Link>
          <span className="font-inter text-[14px] text-white/85 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Secure Checkout
          </span>
        </div>
      </header>
    );
  }

  // ─── Step Indicator ──────────────────────────────────────────────────────────
  function StepIndicator() {
    return (
      <div className="flex items-center justify-center" style={{ height: 64 }}>
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex items-center">
              {/* Connecting line before (not for first step) */}
              {index > 0 && (
                <div
                  className="h-[2px] transition-colors"
                  style={{
                    width: 48,
                    backgroundColor: isCompleted || isActive ? "#2D6A4F" : "#E0E0E0",
                  }}
                />
              )}

              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    if (isCompleted) setCurrentStep(step.id);
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
                  className={`font-inter text-[12px] whitespace-nowrap ${
                    isActive || isCompleted
                      ? "font-semibold text-dark"
                      : "text-muted"
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

  // ─── Address Step ────────────────────────────────────────────────────────────
  function AddressStep() {
    return (
      <div>
        <h2 className="font-outfit text-[18px] font-bold text-dark mb-5">
          Delivery Address
        </h2>
        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[13px] font-medium text-text-label">
              Full Name *
            </label>
            <input
              type="text"
              value={address.fullName}
              onChange={(e) => handleAddressChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              className="h-11 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[13px] font-medium text-text-label">
              Phone Number *
            </label>
            <input
              type="tel"
              value={address.phone}
              onChange={(e) => handleAddressChange("phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="h-11 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
            />
          </div>

          {/* Pincode + City row */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-inter text-[13px] font-medium text-text-label">
                Pincode *
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => handleAddressChange("pincode", e.target.value)}
                placeholder="6 digit pincode"
                maxLength={6}
                className="h-11 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-inter text-[13px] font-medium text-text-label">
                City *
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="City"
                className="h-11 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
              />
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[13px] font-medium text-text-label">
              Address Line 1 *
            </label>
            <input
              type="text"
              value={address.address1}
              onChange={(e) => handleAddressChange("address1", e.target.value)}
              placeholder="House no., Building, Street"
              className="h-11 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
            />
          </div>

          {/* Address Line 2 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[13px] font-medium text-text-label">
              Address Line 2
            </label>
            <input
              type="text"
              value={address.address2}
              onChange={(e) => handleAddressChange("address2", e.target.value)}
              placeholder="Landmark, Area (optional)"
              className="h-11 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
            />
          </div>

          {/* State */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[13px] font-medium text-text-label">
              State *
            </label>
            <input
              type="text"
              value={address.stateRegion}
              onChange={(e) => handleAddressChange("stateRegion", e.target.value)}
              placeholder="State"
              className="h-11 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
            />
          </div>

          {/* Continue button */}
          <button
            onClick={() => setCurrentStep(2)}
            className="mt-2 flex h-[52px] w-[280px] items-center justify-center rounded-[8px] bg-forest font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  // ─── Payment Step ────────────────────────────────────────────────────────────
  function PaymentStep() {
    const paymentOptions: { value: PaymentMethod; label: string; desc: string }[] = [
      { value: "upi", label: "UPI", desc: "Pay using any UPI app" },
      { value: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
      { value: "netbanking", label: "Net Banking", desc: "All major banks supported" },
      { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive" },
    ];

    return (
      <div>
        <h2 className="font-outfit text-[18px] font-bold text-dark mb-5">
          Payment Method
        </h2>

        <div className="flex flex-col gap-3">
          {paymentOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 rounded-[10px] border p-4 cursor-pointer transition-colors ${
                paymentMethod === option.value
                  ? "border-forest bg-surface-green"
                  : "border-border hover:border-border-green"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={option.value}
                checked={paymentMethod === option.value}
                onChange={() => setPaymentMethod(option.value)}
                className="mt-0.5 accent-forest"
              />
              <div>
                <p className="font-inter text-[14px] font-semibold text-dark">
                  {option.label}
                </p>
                <p className="font-inter text-[12px] text-muted">
                  {option.desc}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* UPI expanded state */}
        {paymentMethod === "upi" && (
          <div className="mt-4 flex items-center gap-3">
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="h-11 flex-1 rounded-[8px] border border-border bg-white px-3 font-inter text-[14px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
            />
            <button className="h-11 rounded-[8px] border border-forest px-5 font-inter text-[13px] font-semibold text-forest transition-colors hover:bg-forest hover:text-white">
              Verify
            </button>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={() => setCurrentStep(3)}
          className="mt-6 flex h-[52px] w-[280px] items-center justify-center rounded-[8px] bg-forest font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark"
        >
          Continue to Review
        </button>
      </div>
    );
  }

  // ─── Review Step ─────────────────────────────────────────────────────────────
  function ReviewStep() {
    const paymentLabels: Record<PaymentMethod, string> = {
      upi: "UPI",
      card: "Credit / Debit Card",
      netbanking: "Net Banking",
      cod: "Cash on Delivery",
    };

    return (
      <div>
        <h2 className="font-outfit text-[18px] font-bold text-dark mb-5">
          Review Your Order
        </h2>

        {/* Address summary */}
        <div className="rounded-[10px] border border-border p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-inter text-[14px] font-semibold text-dark">
              Delivery Address
            </h3>
            <button
              onClick={() => setCurrentStep(1)}
              className="font-inter text-[13px] text-forest hover:text-forest-dark"
            >
              Edit
            </button>
          </div>
          <p className="font-inter text-[13px] text-text-secondary leading-relaxed">
            {address.fullName || "Not provided"}<br />
            {address.address1}{address.address2 ? `, ${address.address2}` : ""}<br />
            {address.city}{address.stateRegion ? `, ${address.stateRegion}` : ""} {address.pincode}<br />
            {address.phone}
          </p>
        </div>

        {/* Payment summary */}
        <div className="rounded-[10px] border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-inter text-[14px] font-semibold text-dark">
              Payment Method
            </h3>
            <button
              onClick={() => setCurrentStep(2)}
              className="font-inter text-[13px] text-forest hover:text-forest-dark"
            >
              Edit
            </button>
          </div>
          <p className="font-inter text-[13px] text-text-secondary">
            {paymentLabels[paymentMethod]}
            {paymentMethod === "upi" && upiId ? ` (${upiId})` : ""}
          </p>
        </div>

        {/* Place Order button */}
        <button
          onClick={() => {
            alert("Order placed! (MVP demo — no real payment processing)");
          }}
          className="flex h-[52px] w-[280px] items-center justify-center rounded-[8px] bg-forest font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark"
        >
          Place Order &mdash; {formatPrice(total)}
        </button>
      </div>
    );
  }

  // ─── Order Summary Sidebar ───────────────────────────────────────────────────
  function OrderSummary() {
    return (
      <div
        className="rounded-[12px] bg-surface-green border border-border-green flex flex-col"
        style={{ padding: 20, gap: 12 }}
      >
        <h2 className="font-outfit text-[16px] font-bold text-dark">
          Order Summary
        </h2>

        {/* Item list */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.sku} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px] bg-surface-3">
                <img
                  src={getProductImage(item.category, item.image_url)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-[13px] font-medium text-dark truncate">
                  {item.name}
                </p>
                <p className="font-inter text-[12px] text-muted">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-inter text-[13px] font-medium text-dark shrink-0">
                {formatPrice(item.special_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border-green" />

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="font-inter text-[14px] text-text-secondary">
            Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
          <span className="font-inter text-[14px] text-dark">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="font-inter text-[14px] text-text-secondary">
            Shipping
          </span>
          <span className="font-inter text-[14px] text-dark">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>

        <div className="border-t border-border-green" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-outfit text-[16px] font-bold text-dark">
            Total
          </span>
          <span className="font-outfit text-[20px] font-bold text-dark">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    );
  }

  // ─── Main Render ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <>
        <CheckoutHeader />
        <main className="min-h-screen bg-white">
          <div className="content-container flex flex-col items-center justify-center py-20 text-center">
            <h1 className="font-outfit text-[22px] font-bold text-dark mb-2">
              Your cart is empty
            </h1>
            <p className="font-inter text-[14px] text-muted mb-6">
              Add some products before checking out.
            </p>
            <Link
              href="/products"
              className="flex h-12 items-center justify-center rounded-[8px] bg-forest px-8 font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <CheckoutHeader />

      <main className="min-h-screen bg-white">
        <div
          className="content-container"
          style={{ paddingTop: 40, paddingBottom: 80 }}
        >
          {/* Step Indicator */}
          <StepIndicator />

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row" style={{ gap: 40, marginTop: 32 }}>
            {/* ── LEFT: Form Column ──────────────────────────────────── */}
            <div className="flex-1">
              {currentStep === 1 && <AddressStep />}
              {currentStep === 2 && <PaymentStep />}
              {currentStep === 3 && <ReviewStep />}
            </div>

            {/* ── RIGHT: Order Summary ───────────────────────────────── */}
            <div className="w-full lg:w-[320px] shrink-0">
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
