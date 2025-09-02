"use client";

import { CouponCaptureForm } from "@/components/coupon-processing/CouponCaptureForm";
import Link from "next/link";

export default function ScanPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/coupons"
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 p-3 -ml-3 rounded-lg active:bg-gray-100 touch-manipulation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden md:inline">Back</span>
          <span className="sr-only"> to coupons</span>
        </Link>
        <h1 className="text-2xl font-bold">Add New Coupon</h1>
      </div>
      <CouponCaptureForm />
    </div>
  );
}
