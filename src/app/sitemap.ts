import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/constants";
import prisma from "@/lib/prisma";

const staticPages = ["", "/courses", "/about", "/blog", "/contact", "/pricing", "/faq"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${SITE_CONFIG.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  let courseEntries: MetadataRoute.Sitemap = [];
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true, deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
    courseEntries = courses.map((course) => ({
      url: `${SITE_CONFIG.url}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Database may not be available during build
  }

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
    blogEntries = posts.map((post) => ({
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Database may not be available during build
  }

  return [...staticEntries, ...courseEntries, ...blogEntries];
}
