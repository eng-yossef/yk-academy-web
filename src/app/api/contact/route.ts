import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

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

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        subject: result.data.subject,
        message: result.data.message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: contactMessage,
        message: "Your message has been sent successfully. We'll get back to you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
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
