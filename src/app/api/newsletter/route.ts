import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const rl = rateLimit(`newsletter:${ip}`, 5, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: result.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email: result.data.email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "Already subscribed",
            message: "You are already subscribed to our newsletter.",
          },
          { status: 409 }
        );
      }

      await prisma.subscriber.update({
        where: { email: result.data.email },
        data: { isActive: true, name: result.data.name || existing.name },
      });

      return NextResponse.json({
        success: true,
        message: "Welcome back! Your subscription has been reactivated.",
      });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email: result.data.email,
        name: result.data.name || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: subscriber.id },
        message: "Thank you for subscribing to our newsletter!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
