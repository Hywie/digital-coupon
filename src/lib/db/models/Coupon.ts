import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const CouponSchema = z.object({
  barcode: z.string().length(13),
  description: z.string().min(5).max(100),
  expiryDate: z.date(),
  status: z.enum(['active', 'used', 'expired']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript interface
export interface ICoupon extends Document {
  barcode: string;
  description: string;
  expiryDate: Date;
  status: 'active' | 'used' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const couponSchema = new Schema<ICoupon>(
  {
    barcode: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => v.length === 13 && /^\d+$/.test(v),
        message: "Barcode must be 13 digits",
      },
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
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
