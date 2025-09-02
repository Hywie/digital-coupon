import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { Coupon } from "@/lib/db/models/Coupon";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all coupons
    const coupons = await Coupon.find();
    
    // Current date at the start of the day (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check each coupon for expiry
    const updatedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        // Convert expiry date to start of day for comparison
        const expiryDate = new Date(coupon.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);

        // If coupon is active and has expired, update its status
        if (coupon.status === "active" && expiryDate < today) {
          const updatedCoupon = await Coupon.findByIdAndUpdate(
            coupon._id,
            { status: "expired" },
            { new: true }
          );
          return updatedCoupon;
        }
        return coupon;
      })
    );

    // Sort by created date, newest first
    updatedCoupons.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
      
    return NextResponse.json(updatedCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

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
