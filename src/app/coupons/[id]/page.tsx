"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ICoupon } from "@/lib/db/models/Coupon";

export default function EditCouponPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [coupon, setCoupon] = useState<ICoupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    expiryDate: "",
    status: "active" as "active" | "used",
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await fetch(`/api/coupons/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch coupon");
        const data = await response.json();
        setCoupon(data);
        setFormData({
          description: data.description,
          expiryDate: new Date(data.expiryDate).toISOString().split("T")[0],
          status: data.status === "expired" ? "used" : data.status,
        });
      } catch (err) {
        setError("Failed to load coupon");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupon();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // If the coupon is expired, force the status to "expired"
      const isExpired = new Date(formData.expiryDate) < new Date();

      const response = await fetch(`/api/coupons/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // Override status to "expired" if the expiry date is in the past
          status: isExpired ? "expired" : formData.status,
        }),
      });

      if (!response.ok) throw new Error("Failed to update coupon");
      router.push("/coupons");
    } catch (err) {
      setError("Failed to update coupon");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/coupons/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete coupon");
      router.push("/coupons");
    } catch (err) {
      setError("Failed to delete coupon");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error || "Coupon not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-2xl font-bold">Edit Coupon</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as "active" | "used",
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="used">Used</option>
            </select>
            {new Date(formData.expiryDate) < new Date() &&
              formData.status === "active" && (
                <p className="mt-1 text-sm text-amber-600">
                  Note: This coupon has expired but can still be marked as
                  active
                </p>
              )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
              className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete Coupon"}
            </button>

            <div className="flex gap-4">
              <Link
                href="/coupons"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
