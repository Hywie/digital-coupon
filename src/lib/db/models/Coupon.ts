import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const CouponSchema = z.object({
  imageUrl: z.string().url(),
  barcode: z.string(),
  value: z.string(),
  expiryDate: z.date(),
  status: z.enum(['active', 'used', 'expired']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript interface
export interface ICoupon extends Document {
  imageUrl: string;
  barcode: string;
  value: string;
  expiryDate: Date;
  status: 'active' | 'used' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const couponSchema = new Schema<ICoupon>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'used', 'expired'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Check if model exists before creating a new one
export const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);
