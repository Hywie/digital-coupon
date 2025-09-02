"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import type { ICoupon } from "@/lib/db/models/Coupon";
import { Barcode } from "./Barcode";
import Link from "next/link";

interface SwipeableCouponCardProps {
  coupon: ICoupon;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: "used") => Promise<void>;
}

export function SwipeableCouponCard({
  coupon,
  onDelete,
  onStatusChange,
}: SwipeableCouponCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const cardOpacity = useTransform(x, [-100, 0, 100], [0.3, 1, 0.3]);
  const springX = useSpring(0, {
    damping: 25,
    stiffness: 300,
    mass: 0.5,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Format date to local string
  const expiryDate = new Date(coupon.expiryDate).toLocaleDateString();

  // Determine status badge color
  const statusColors = {
    active: "bg-green-100 text-green-800",
    used: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
  };

  const leftConstraints = {
    active: -180,
    used: -130,
    expired: -130,
  };

  const handleDragEnd = async (event: any) => {
    const currentX = x.get();
    const velocity = event?.velocity?.x || 0;
    setIsDragging(false);

    // If swipe was fast enough or past threshold, snap open
    if (velocity < -300 || currentX < -45) {
      springX.set(leftConstraints[coupon.status]);
      x.set(leftConstraints[coupon.status]);
    } else {
      // Otherwise snap closed
      springX.set(0);
      x.set(0);
    }
  };

  const toggleBarcode = () => {
    if (!isDragging) {
      setShowBarcode(!showBarcode);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setIsDeleting(true);
      try {
        await onDelete(coupon._id);
      } catch (error) {
        console.error("Failed to delete coupon:", error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Action buttons container - underneath the card */}
      <div className="absolute inset-0 flex justify-end items-stretch">
        <Link
          href={`/coupons/${coupon._id}`}
          className="flex items-center justify-center w-20 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Link>
        {coupon.status === "active" && (
          <button
            onClick={() => onStatusChange(coupon._id, "used")}
            className="flex items-center justify-center w-15 bg-green-500 hover:bg-green-600 text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center w-15 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Swipeable card */}
      <motion.div
        ref={containerRef}
        style={{ x: springX, opacity: cardOpacity }}
        drag="x"
        dragDirectionLock
        dragMomentum={true}
        dragTransition={{
          bounceStiffness: 700, //400
          bounceDamping: 30, //40
          power: 0.8, // Reduces the momentum 0.3
        }}
        dragConstraints={{ left: leftConstraints[coupon.status], right: 0 }}
        dragElastic={0.3}
        whileDrag={{ cursor: "grabbing" }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="relative bg-white rounded-lg shadow-sm touch-pan-y will-change-transform border-2"
      >
        <div className="p-4 space-y-4">
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
            <AnimatePresence>
              {showBarcode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Barcode value={coupon.barcode} height={80} />
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Present this barcode at the checkout
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
