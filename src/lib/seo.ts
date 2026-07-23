import type { Metadata } from "next";
import { SITE_CONFIG } from "@/config/constants";

export interface PageSEO {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export interface CourseSEO {
  title: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  level?: string;
  duration?: number;
}

export interface BlogSEO {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedTime: string;
  modifiedTime: string;
  author?: string;
  tags?: string[];
}

export function generateMetadata(page: PageSEO): Metadata {
  const url = page.url ?? SITE_CONFIG.url;
  const image = page.image ?? SITE_CONFIG.ogImage;

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image, width: 1200, height: 630, alt: page.title }],
      locale: "en_US",
      type: page.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export function generateCourseMetadata(course: CourseSEO): Metadata {
  const url = `${SITE_CONFIG.url}/courses/${course.slug}`;
  const image = course.image ?? SITE_CONFIG.ogImage;

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image, width: 1200, height: 630, alt: course.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export function generateBlogMetadata(post: BlogSEO): Metadata {
  const url = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const image = post.image ?? SITE_CONFIG.ogImage;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

type JsonLdType = "Organization" | "Course" | "BlogPosting" | "FAQPage" | "WebSite" | "BreadcrumbList";

export function generateJsonLd(
  type: JsonLdType,
  data: Record<string, unknown>
): string {
  const baseContext = "https://schema.org";

  const jsonLd: Record<string, unknown> = {
    "@context": baseContext,
    "@type": type,
    ...data,
  };

  return JSON.stringify(jsonLd, null, 2);
}

export function generateOrganizationJsonLd() {
  return generateJsonLd("Organization", {
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
    },
    sameAs: Object.values(SITE_CONFIG.social),
  });
}

export function generateWebsiteJsonLd() {
  return generateJsonLd("WebSite", {
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/courses?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

export function generateCourseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  level?: string;
}) {
  return generateJsonLd("Course", {
    name: course.title,
    description: course.description,
    url: `${SITE_CONFIG.url}/courses/${course.slug}`,
    image: course.image ?? SITE_CONFIG.ogImage,
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    offers: {
      "@type": "Offer",
      price: course.price ?? 0,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: course.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: course.rating,
          reviewCount: course.reviewCount ?? 0,
        }
      : undefined,
  });
}

export function generateBlogJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedTime: string;
  modifiedTime: string;
  author?: string;
}) {
  return generateJsonLd("BlogPosting", {
    headline: post.title,
    description: post.description,
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    image: post.image ?? SITE_CONFIG.ogImage,
    datePublished: post.publishedTime,
    dateModified: post.modifiedTime,
    author: {
      "@type": "Person",
      name: post.author ?? SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  });
}

export function generateFaqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return generateJsonLd("FAQPage", {
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return generateJsonLd("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}
