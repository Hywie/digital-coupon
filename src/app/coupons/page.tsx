"use client";

import { useEffect, useState } from "react";
import { SwipeableCouponCard } from "@/components/coupon-processing/SwipeableCouponCard";
import type { ICoupon } from "@/lib/db/models/Coupon";
import Link from "next/link";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "used" | "expired">(
    "active"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons");
      if (!response.ok) throw new Error("Failed to fetch coupons");
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      setError("Failed to load coupons");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleStatusChange = async (couponId: string, newStatus: "used") => {
    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update coupon");
      await fetchCoupons();
    } catch (err) {
      console.error("Error updating coupon:", err);
      throw err;
    }
  };

  const handleDelete = async (couponId: string) => {
    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete coupon");
      await fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon:", err);
      throw err;
    }
  };

  const filteredCoupons = coupons
    .filter((coupon) => {
      // First apply status filter
      if (filter === "all") return true;
      if (filter === "expired")
        return (
          new Date(coupon.expiryDate) < new Date() ||
          coupon.status === "expired"
        );
      return coupon.status === filter;
    })
    .filter((coupon) => {
      // Then apply search filter
      if (!searchQuery) return true;
      return coupon.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-1 sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            href="/scan"
            className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
            aria-label="Add New Coupon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", "active", "used", "expired"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchQuery || filter !== "all"
              ? "No coupons match your search"
              : "No coupons found"}
          </p>
          {!searchQuery && (filter === "all" || filter === "active") && (
            <Link
              href="/scan"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Add your first coupon
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCoupons.map((coupon) => (
            <SwipeableCouponCard
              key={coupon._id}
              coupon={coupon}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
