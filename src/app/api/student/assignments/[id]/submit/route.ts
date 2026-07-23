import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: assignmentId } = await params;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    if (assignment.course.enrollments.length === 0) {
      return NextResponse.json(
        { success: false, error: "Not enrolled in this course" },
        { status: 403 }
      );
    }

    const existingSubmission = await prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: session.user.id,
        },
      },
    });

    const body = await request.formData();
    const content = body.get("content") as string | null;
    const file = body.get("file") as File | null;

    let fileUrl: string | null = null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop();
      const filename = `${session.user.id}-${assignmentId}-${Date.now()}.${ext}`;
      const path = `uploads/submissions/${filename}`;
      const { writeFile } = await import("fs/promises");
      const { join } = await import("path");
      const uploadDir = join(process.cwd(), "public", path);
      await writeFile(uploadDir, buffer);
      fileUrl = `/${path}`;
    }

    if (existingSubmission) {
      const updated = await prisma.assignmentSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          content: content ?? existingSubmission.content,
          fileUrl: fileUrl ?? existingSubmission.fileUrl,
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, data: updated });
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId: session.user.id,
        content: content ?? undefined,
        fileUrl: fileUrl ?? undefined,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error("Failed to submit assignment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
