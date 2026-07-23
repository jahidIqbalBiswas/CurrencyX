import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AdminRepository } from "@/repositories/admin.repository";
import { AUTH_COOKIE_NAME, COOKIE_MAX_AGE, JWT_EXPIRY } from "@/constants";
import type { JwtPayload } from "@/types/common.types";

const SALT_ROUNDS = 12;

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

export const AuthService = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  async generateToken(sub: string, email: string): Promise<string> {
    return new SignJWT({ sub, email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .sign(getJwtSecret());
  },

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      return payload as unknown as JwtPayload;
    } catch {
      return null;
    }
  },

  /**
   * Authenticates admin credentials and returns a JWT token.
   * Returns null if credentials are invalid.
   */
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; email: string } | null> {
    const admin = await AdminRepository.findByEmail(email);
    if (!admin) return null;

    const isValid = await this.comparePassword(password, admin.passwordHash);
    if (!isValid) return null;

    const token = await this.generateToken(
      admin._id.toString(),
      admin.email
    );

    return { token, email: admin.email };
  },

  /** Sets the JWT as an HTTP-only secure cookie */
  async setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  },

  /** Clears the auth cookie */
  async clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  },

  /** Retrieves and verifies the current session from cookie */
  async getCurrentSession(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return this.verifyToken(token);
  },

  /**
   * Seeds the initial admin user from environment variables.
   * Only runs if no admin exists in the database.
   */
  async seedAdmin(): Promise<void> {
    const exists = await AdminRepository.exists();
    if (exists) return;

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping seed.");
      return;
    }

    const passwordHash = await this.hashPassword(password);
    await AdminRepository.create(email, passwordHash);
    console.log(`✅ Admin user seeded: ${email}`);
  },
};
