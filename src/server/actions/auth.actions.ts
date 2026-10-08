"use server";

import { signIn, signOut } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import type { ActionResult } from "@/types";
import { AuthError } from "next-auth";

/**
 * Foundation server action for credentials sign-in.
 */
export async function loginAction(
  input: LoginInput
): Promise<ActionResult<{ redirectTo?: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "Authentication failed. Please try again." };
      }
    }
    return { success: false, error: "An unexpected error occurred during login." };
  }
}

/**
 * Foundation server action for sign-out.
 */
export async function logoutAction(): Promise<ActionResult<void>> {
  try {
    await signOut({ redirect: false });
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to sign out" };
  }
}
