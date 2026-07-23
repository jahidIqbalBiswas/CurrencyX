"use server";

import { revalidatePath } from "next/cache";
import { AuthService, SettingsService, HistoryService, ExchangeService } from "@/services";
import { manualRateSchema } from "@/validators/rate.validator";
import { switchModeSchema } from "@/validators/mode.validator";
import type { ActionResult } from "@/types/api.types";

/**
 * Verifies the admin session from the current cookie.
 * Throws if not authenticated.
 */
async function requireAuth(): Promise<string> {
  const session = await AuthService.getCurrentSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session.email;
}

export async function updateManualRate(
  formData: FormData
): Promise<ActionResult> {
  try {
    const adminEmail = await requireAuth();

    const rawRate = formData.get("rate");
    const parsed = manualRateSchema.safeParse({
      rate: rawRate ? Number(rawRate) : undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        error: parsed.error.issues[0]?.message ?? "Invalid rate",
      };
    }

    const { oldRate, newRate } = await SettingsService.updateManualRate(
      parsed.data.rate
    );

    await HistoryService.logChange(oldRate, newRate, "manual", adminEmail);

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Manual rate updated to ${newRate} BDT`,
    };
  } catch (error) {
    console.error("Update manual rate error:", error);
    return {
      success: false,
      message: "Failed to update rate",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function switchMode(
  formData: FormData
): Promise<ActionResult> {
  try {
    const adminEmail = await requireAuth();

    const rawMode = formData.get("mode");
    const parsed = switchModeSchema.safeParse({ mode: rawMode });

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        error: parsed.error.issues[0]?.message ?? "Invalid mode",
      };
    }

    const settings = await SettingsService.getSettings();
    const currentRate =
      settings.mode === "manual" ? settings.manualRate : settings.liveRate;
    const newRate =
      parsed.data.mode === "manual" ? settings.manualRate : settings.liveRate;

    await SettingsService.switchMode(parsed.data.mode);

    await HistoryService.logChange(
      currentRate,
      newRate,
      parsed.data.mode,
      adminEmail
    );

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Switched to ${parsed.data.mode} mode`,
    };
  } catch (error) {
    console.error("Switch mode error:", error);
    return {
      success: false,
      message: "Failed to switch mode",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function refreshLiveRate(): Promise<ActionResult> {
  try {
    const adminEmail = await requireAuth();

    const settings = await SettingsService.getSettings();
    const oldRate = settings.liveRate;

    const newRate = await ExchangeService.refreshLiveRate();

    if (newRate !== oldRate && newRate > 0) {
      await HistoryService.logChange(oldRate, newRate, "live", adminEmail);
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    if (newRate === 0) {
      return {
        success: false,
        message: "API is unreachable. Using cached rate.",
        error: "Exchange rate API is currently unavailable",
      };
    }

    return {
      success: true,
      message: `Live rate refreshed: ${newRate} BDT`,
    };
  } catch (error) {
    console.error("Refresh live rate error:", error);
    return {
      success: false,
      message: "Failed to refresh rate",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
