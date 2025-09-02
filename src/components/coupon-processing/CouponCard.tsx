"use client";

import { useState } from "react";
import type { ICoupon } from "@/lib/db/models/Coupon";
import { Barcode } from "./Barcode";
import Link from "next/link";

interface CouponCardProps {
  coupon: ICoupon;
  onStatusChange: (
    couponId: string,
    newStatus: "active" | "used" | "expired"
  ) => Promise<void>;
}

export function CouponCard({ coupon, onStatusChange }: CouponCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);

  // Format date to local string
  const expiryDate = new Date(coupon.expiryDate).toLocaleDateString();
  const isExpired = new Date(coupon.expiryDate) < new Date();

  // Determine status badge color
  const statusColors = {
    active: "bg-green-100 text-green-800",
    used: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
  };

  const handleStatusChange = async (
    newStatus: "active" | "used" | "expired"
  ) => {
    setIsLoading(true);
    try {
      await onStatusChange(coupon._id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBarcode = () => {
    setShowBarcode(!showBarcode);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      {/* Description and Status */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="font-medium">{coupon.description}</p>
          <p className="text-sm text-gray-500">Expires: {expiryDate}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[coupon.status]
          }`}
        >
          {coupon.status}
        </span>
      </div>

      {/* Barcode Section */}
      <div className="space-y-2">
        <button
          onClick={toggleBarcode}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {showBarcode ? "Hide" : "Show"} Barcode
          <svg
            className={`w-4 h-4 transform transition-transform ${
              showBarcode ? "rotate-180" : ""
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showBarcode && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <Barcode value={coupon.barcode} height={80} />
            <p className="text-center text-sm text-gray-500 mt-2">
              Present this barcode at the checkout
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center gap-2">
        <Link
          href={`/coupons/${coupon._id}`}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Edit Coupon
        </Link>

        <button
          onClick={() => handleStatusChange("used")}
          disabled={isLoading || coupon.status === "used" || isExpired}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${
            coupon.status === "used"
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : isExpired
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {coupon.status === "used"
            ? "Already Used"
            : isExpired
            ? "Expired"
            : isLoading
            ? "Marking..."
            : "Mark as Used"}
        </button>
      </div>
    </div>
  );
}
