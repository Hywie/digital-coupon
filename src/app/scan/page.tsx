"use client";

import { CouponCaptureForm } from "@/components/coupon-processing/CouponCaptureForm";

export default function ScanPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Coupon</h1>
      <CouponCaptureForm />
    </div>
  );
}
