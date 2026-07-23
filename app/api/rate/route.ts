import { NextResponse } from "next/server";
import { ExchangeService } from "@/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rateInfo = await ExchangeService.getCurrentRate();

    return NextResponse.json({
      success: true,
      data: rateInfo,
    });
  } catch (error) {
    console.error("Rate fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}
