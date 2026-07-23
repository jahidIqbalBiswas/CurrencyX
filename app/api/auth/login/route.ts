import { NextResponse, type NextRequest } from "next/server";
import { AuthService } from "@/services";
import { loginSchema } from "@/validators/auth.validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    // Seed admin on first login attempt (idempotent)
    await AuthService.seedAdmin();

    const result = await AuthService.login(parsed.data.email, parsed.data.password);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await AuthService.setAuthCookie(result.token);

    return NextResponse.json({
      success: true,
      data: {
        email: result.email,
        message: "Login successful",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
