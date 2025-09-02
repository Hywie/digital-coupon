"use client";

import { useState } from "react";
import { BarcodeScanner } from "../camera/BarcodeScanner";

interface CouponData {
  barcode: string;
  expiryDate: string;
  description: string;
}

type Step = "scan" | "expiry" | "description" | "saving";

export function CouponCaptureForm() {
  const [currentStep, setCurrentStep] = useState<Step>("scan");
  const [couponData, setCouponData] = useState<Partial<CouponData>>({});
  const [error, setError] = useState<string>("");

  const handleBarcodeDetected = (barcode: string) => {
    setCouponData((prev) => ({ ...prev, barcode }));
    setCurrentStep("expiry");
  };

  const handleExpirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const expiryDate = formData.get("expiryDate") as string;

    if (!expiryDate) {
      setError("Please select an expiry date");
      return;
    }

    setCouponData((prev) => ({ ...prev, expiryDate }));
    setCurrentStep("description");
  };

  const handleDescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const description = formData.get("description") as string;

    if (!description) {
      setError("Please enter a description");
      return;
    }

    setCurrentStep("saving");
    setCouponData((prev) => ({ ...prev, description }));

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...couponData, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to save coupon");
      }

      // Redirect to coupons list
      window.location.href = "/coupons";
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save coupon"
      );
      setCurrentStep("description");
    }
  };

  const renderExpiryDateForm = () => (
    <form onSubmit={handleExpirySubmit} className="space-y-4">
      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
          When does this coupon expire?
        </label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          min={new Date().toISOString().split("T")[0]}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep("scan")}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );

  const renderDescriptionForm = () => (
    <form onSubmit={handleDescriptionSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          What is this coupon for?
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="e.g., £1 off when you spend £5 on fresh fruit"
          className="w-full p-2 border rounded-lg h-24"
          required
          maxLength={100}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep("expiry")}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Coupon
        </button>
      </div>
    </form>
  );

  const renderSavingState = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
      <p>Saving your coupon...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {["scan", "expiry", "description"].map((step, index) => (
          <div
            key={step}
            className={`flex-1 h-2 rounded-full ${
              currentStep === step
                ? "bg-blue-500"
                : index < ["scan", "expiry", "description"].indexOf(currentStep)
                ? "bg-blue-200"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      {currentStep === "scan" && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onError={setError}
        />
      )}
      {currentStep === "expiry" && renderExpiryDateForm()}
      {currentStep === "description" && renderDescriptionForm()}
      {currentStep === "saving" && renderSavingState()}
    </div>
  );
}
