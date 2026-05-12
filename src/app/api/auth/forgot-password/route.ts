import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const [user] = await db
    .select({ id: users.id, fullName: users.fullName })
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  // Always return 200 to prevent email enumeration
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Remove any existing tokens for this user, then insert new one
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
  await db.insert(passwordResetTokens).values({ token, userId: user.id, expiresAt });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "appname <onboarding@resend.dev>",
    to: email,
    subject: "Reset your appname password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1e293b; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #64748b; margin-bottom: 24px;">
          Hi ${user.fullName}, click the button below to reset your password.
          This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}"
          style="display: inline-block; background: #4f46e5; color: white; text-decoration: none;
                 font-weight: 600; padding: 12px 28px; border-radius: 10px; font-size: 15px;">
          Reset password
        </a>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #cbd5e1; font-size: 12px;">
          Or copy this link: <a href="${resetUrl}" style="color: #6366f1;">${resetUrl}</a>
        </p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
