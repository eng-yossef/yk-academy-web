"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Eye,
  ArrowRight,
  Tag,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

const blogCategories = [
  "All",
  "Web Development",
  "AI & Machine Learning",
  "Programming",
  "Career Tips",
  "Industry News",
];

const posts = [
  {
    slug: "future-of-web-development-2026",
    title: "The Future of Web Development: Trends to Watch in 2026",
    excerpt:
      "Explore the cutting-edge technologies and paradigms shaping the future of web development, from AI-assisted coding to edge computing.",
    category: "Web Development",
    author: "Ahmed Youssef",
    date: "July 15, 2026",
    readTime: "8 min read",
    views: 1250,
    featured: true,
    tags: ["Web Dev", "Trends", "2026"],
  },
  {
    slug: "python-beginners-guide",
    title: "Python for Beginners: Your Complete Learning Roadmap",
    excerpt:
      "A comprehensive guide for absolute beginners to start their Python journey with the right fundamentals and projects.",
    category: "Programming",
    author: "Sara Mohamed",
    date: "July 10, 2026",
    readTime: "12 min read",
    views: 2100,
    featured: false,
    tags: ["Python", "Beginners", "Roadmap"],
  },
  {
    slug: "ai-in-education",
    title: "How AI is Transforming Education in the Middle East",
    excerpt:
      "Discover how artificial intelligence is revolutionizing the way students learn and teachers instruct across the region.",
    category: "AI & Machine Learning",
    author: "Dr. Layla Abbas",
    date: "July 5, 2026",
    readTime: "10 min read",
    views: 980,
    featured: false,
    tags: ["AI", "Education", "Middle East"],
  },
  {
    slug: "react-vs-vue-2026",
    title: "React vs Vue vs Svelte: Which Framework to Choose in 2026?",
    excerpt:
      "An in-depth comparison of the top three frontend frameworks to help you make the right choice for your next project.",
    category: "Web Development",
    author: "Omar Hassan",
    date: "June 28, 2026",
    readTime: "15 min read",
    views: 1800,
    featured: false,
    tags: ["React", "Vue", "Svelte", "Frontend"],
  },
  {
    slug: "career-in-tech",
    title: "Landing Your First Tech Job: A Step-by-Step Guide",
    excerpt:
      "From building your portfolio to acing the interview — everything you need to know to break into the tech industry.",
    category: "Career Tips",
    author: "Karim Mansour",
    date: "June 20, 2026",
    readTime: "11 min read",
    views: 3200,
    featured: false,
    tags: ["Career", "Job Search", "Interview"],
  },
  {
    slug: "devops-best-practices",
    title: "DevOps Best Practices for Modern Development Teams",
    excerpt:
      "Learn the essential DevOps practices that top companies use to ship faster and more reliably.",
    category: "Web Development",
    author: "Karim Mansour",
    date: "June 15, 2026",
    readTime: "9 min read",
    views: 750,
    featured: false,
    tags: ["DevOps", "CI/CD", "Best Practices"],
  },
];

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function BlogPage() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  const filteredPosts = React.useMemo(() => {
    let result = regularPosts;
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, selectedCategory]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-navy-gradient pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Our Blog
            </h1>
            <p className="mt-3 max-w-xl text-gray-300 sm:text-lg">
              Insights, tutorials, and news from the world of technology.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-8 flex gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-mediumGray" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 border-white/10 bg-white/10 pl-10 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <main className="flex-1 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Featured Post */}
          {featuredPost && (
            <FadeIn>
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="mb-12 overflow-hidden rounded-3xl border border-lightGray bg-lightGray/30 shadow-sm transition-shadow hover:shadow-lg">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="relative h-64 bg-gradient-to-br from-electricBlue/20 to-cyan/20 lg:h-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-bold text-electricBlue/20">
                          YK
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-8">
                      <Badge className="mb-4 w-fit">Featured</Badge>
                      <h2 className="mb-3 text-2xl font-bold text-navy sm:text-3xl">
                        {featuredPost.title}
                      </h2>
                      <p className="mb-6 text-mediumGray">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-mediumGray">
                        <span>{featuredPost.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredPost.readTime}
                        </span>
                        <span>·</span>
                        <span>{featuredPost.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          )}

          {/* Categories */}
          <FadeIn>
            <div className="mb-8 flex flex-wrap gap-2">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    selectedCategory === cat
                      ? "bg-electricBlue text-white"
                      : "border border-lightGray bg-white text-mediumGray hover:border-electricBlue hover:text-electricBlue"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 0.08}>
                <Link href={`/blog/${post.slug}`}>
                  <article className="group h-full overflow-hidden rounded-2xl border border-lightGray bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-48 bg-gradient-to-br from-electricBlue/10 to-cyan/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-electricBlue/10">
                          YK
                        </span>
                      </div>
                      <div className="absolute left-3 top-3">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-navy transition-colors group-hover:text-electricBlue">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-mediumGray">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-mediumGray">
                        <span>{post.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-electricBlue">
                        Read More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-navy">No articles found</p>
              <p className="mt-1 text-mediumGray">
                Try adjusting your search or filter.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
