import { NextResponse, type NextRequest } from "next/server";
import { HistoryService } from "@/services";
import { paginationSchema } from "@/validators/query.validator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = paginationSchema.safeParse({
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const history = await HistoryService.getHistory(
      parsed.data.cursor,
      parsed.data.limit
    );

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
