import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { Coupon } from "@/lib/db/models/Coupon";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Validate status
    if (!["active", "used", "expired"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and update the coupon
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}
