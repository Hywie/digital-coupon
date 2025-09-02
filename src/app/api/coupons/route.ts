import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { Coupon } from "@/lib/db/models/Coupon";

export async function POST(request: Request) {
  try {
    const { barcode, expiryDate, description } = await request.json();

    // Validate required fields
    if (!barcode || !expiryDate || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ barcode });
    if (existingCoupon) {
      return NextResponse.json(
        { error: "This coupon has already been added" },
        { status: 409 }
      );
    }

    // Create new coupon
    const coupon = await Coupon.create({
      barcode,
      expiryDate: new Date(expiryDate),
      description,
      status: "active",
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Error saving coupon:", error);
    return NextResponse.json(
      { error: "Failed to save coupon" },
      { status: 500 }
    );
  }
}
