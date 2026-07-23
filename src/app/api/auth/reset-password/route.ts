import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;

    // Find the reset token log entry
    // We query by action and then filter the JSON details for the matching token
    const resetLogs = await prisma.activityLog.findMany({
      where: {
        action: "PASSWORD_RESET_TOKEN",
      },
      orderBy: { createdAt: "desc" },
    });

    // Find the matching token entry
    const resetLog = resetLogs.find((log) => {
      const details = log.details as Record<string, unknown> | null;
      return details?.token === token;
    });

    if (!resetLog) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check expiry
    const details = resetLog.details as Record<string, unknown>;
    const expiresAt = new Date(details.expiresAt as string);

    if (expiresAt < new Date()) {
      // Delete expired token
      await prisma.activityLog.delete({ where: { id: resetLog.id } });

      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const userId = details.userId as string;

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Delete the used reset token
    await prisma.activityLog.delete({ where: { id: resetLog.id } });

    // Also clean up any other reset tokens for this user
    await prisma.activityLog.deleteMany({
      where: {
        userId,
        action: "PASSWORD_RESET_TOKEN",
      },
    });

    return NextResponse.json({
      message: "Password has been reset successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
