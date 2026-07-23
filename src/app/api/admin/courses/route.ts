import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;

    const courses = await prisma.course.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        instructor: { select: { id: true, name: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      shortDescription: c.shortDescription,
      level: c.level,
      price: c.price,
      discountPrice: c.discountPrice,
      isPublished: c.isPublished,
      isFeatured: c.isFeatured,
      tags: c.tags,
      image: c.image,
      enrolledCount: c.enrolledCount,
      rating: c.rating,
      categoryId: c.categoryId,
      instructorId: c.instructorId,
      category: c.category,
      instructor: c.instructor,
      students: c._count.enrollments,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
}

const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  price: z.number().min(0).optional(),
  discountPrice: z.number().min(0).nullable().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  instructorId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, shortDescription, level, categoryId, price, discountPrice, tags, isPublished, instructorId } = parsed.data;

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        level: level || "BEGINNER",
        categoryId,
        price: price || 0,
        discountPrice,
        tags: tags || [],
        isPublished: isPublished || false,
        instructorId: instructorId || session.user.id,
      },
    });

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create course" }, { status: 500 });
  }
}
