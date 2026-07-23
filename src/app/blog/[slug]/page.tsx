"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Eye,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const blogData = {
  title: "The Future of Web Development: Trends to Watch in 2026",
  category: "Web Development",
  author: {
    name: "Ahmed Youssef",
    initials: "AY",
    title: "Senior Full-Stack Engineer",
  },
  date: "July 15, 2026",
  readTime: "8 min read",
  views: 1250,
  content: `
The web development landscape is evolving at an unprecedented pace. As we move through 2026, several transformative trends are reshaping how we build, deploy, and interact with web applications.

## 1. AI-Assisted Development

Large language models and AI coding assistants have become indispensable tools for modern developers. From generating boilerplate code to suggesting optimizations, AI is augmenting developer productivity in ways we couldn't have imagined just a few years ago.

Key developments include intelligent code completion that understands project context, automated code review that catches bugs before they reach production, and natural language to code translation that accelerates prototyping.

## 2. Edge Computing Goes Mainstream

Edge computing has moved from niche to mainstream, with frameworks like Next.js, Nuxt, and SvelteKit leading the charge. Applications are now running closer to users than ever before, delivering sub-50ms response times globally.

The shift to edge has profound implications for architecture decisions. Developers need to think carefully about data locality, cache invalidation strategies, and the trade-offs between edge and serverless computing.

## 3. WebAssembly Expands Possibilities

WebAssembly (Wasm) continues to expand the boundaries of what's possible in the browser. From running complex CAD software to executing machine learning models client-side, Wasm is enabling experiences that were previously impossible on the web.

## 4. Progressive Enhancement Reborn

There's a renewed focus on progressive enhancement and resilience. Developers are building applications that work beautifully without JavaScript, then layer on interactivity. This approach yields better performance, accessibility, and reliability.

## 5. The Component Renaissance

Component-based architecture has matured significantly. Server components, islands architecture, and partial hydration patterns are allowing developers to ship less JavaScript while delivering richer experiences.

## Conclusion

The future of web development is bright, diverse, and more accessible than ever. The key to thriving in this landscape is staying curious, building real projects, and embracing the tools that make you more productive.
  `,
  tags: ["Web Dev", "Trends", "2026", "AI", "Edge Computing"],
  relatedPosts: [
    {
      slug: "react-vs-vue-2026",
      title: "React vs Vue vs Svelte: Which Framework to Choose in 2026?",
      category: "Web Development",
      date: "June 28, 2026",
      readTime: "15 min read",
    },
    {
      slug: "devops-best-practices",
      title: "DevOps Best Practices for Modern Development Teams",
      category: "Web Development",
      date: "June 15, 2026",
      readTime: "9 min read",
    },
    {
      slug: "python-beginners-guide",
      title: "Python for Beginners: Your Complete Learning Roadmap",
      category: "Programming",
      date: "July 10, 2026",
      readTime: "12 min read",
    },
  ],
  comments: [
    {
      name: "Mohamed Ali",
      initials: "MA",
      date: "July 16, 2026",
      content:
        "Fantastic article! The section on AI-assisted development really resonated with me. I've been using Copilot daily and it's changed how I write code.",
    },
    {
      name: "Fatma Hassan",
      initials: "FH",
      date: "July 17, 2026",
      content:
        "Great overview of the current landscape. I'd love to see a deeper dive into WebAssembly use cases in a future post.",
    },
  ],
};

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

export default function BlogPostPage() {
  const [commentName, setCommentName] = React.useState("");
  const [commentContent, setCommentContent] = React.useState("");

  const contentHtml = blogData.content
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) {
        return `<h2 class="text-2xl font-bold text-navy mt-8 mb-4">${line.slice(3)}</h2>`;
      }
      if (line.startsWith("## ")) return "";
      if (line.trim() === "") return '<div class="h-4"></div>';
      return `<p class="text-mediumGray leading-relaxed mb-4">${line}</p>`;
    })
    .join("");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-white pt-20">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <FadeIn>
            <div className="mb-6 flex items-center gap-2 text-sm text-mediumGray">
              <Link href="/" className="hover:text-electricBlue transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-electricBlue transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-navy font-medium">Article</span>
            </div>
          </FadeIn>

          {/* Header */}
          <FadeIn delay={0.1}>
            <Badge className="mb-4">{blogData.category}</Badge>
            <h1 className="mb-6 text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              {blogData.title}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-electricBlue text-white">
                    {blogData.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-navy">
                    {blogData.author.name}
                  </p>
                  <p className="text-sm text-mediumGray">
                    {blogData.author.title}
                  </p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-4 text-sm text-mediumGray">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {blogData.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {blogData.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {blogData.views} views
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Cover */}
          <FadeIn delay={0.15}>
            <div className="mb-10 aspect-video rounded-3xl bg-gradient-to-br from-electricBlue/10 to-cyan/10 flex items-center justify-center">
              <span className="text-8xl font-bold text-electricBlue/10">YK</span>
            </div>
          </FadeIn>

          {/* Content */}
          <FadeIn delay={0.2}>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </FadeIn>

          {/* Tags */}
          <FadeIn delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-mediumGray" />
              {blogData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </FadeIn>

          {/* Share */}
          <FadeIn delay={0.3}>
            <div className="mt-8 flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </FadeIn>

          <Separator className="my-12" />

          {/* Comments */}
          <FadeIn delay={0.35}>
            <h2 className="mb-6 text-2xl font-bold text-navy">
              Comments ({blogData.comments.length})
            </h2>

            <div className="mb-8 space-y-6">
              {blogData.comments.map((comment) => (
                <div
                  key={comment.name}
                  className="rounded-xl border border-lightGray p-5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-electricBlue text-white text-xs">
                        {comment.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-navy">{comment.name}</p>
                      <p className="text-xs text-mediumGray">{comment.date}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-mediumGray">{comment.content}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-lightGray p-6">
              <h3 className="mb-4 text-lg font-semibold text-navy">
                Leave a Comment
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                />
                <Textarea
                  placeholder="Write your comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                />
                <Button>Post Comment</Button>
              </div>
            </div>
          </FadeIn>

          <Separator className="my-12" />

          {/* Related Posts */}
          <FadeIn delay={0.4}>
            <h2 className="mb-6 text-2xl font-bold text-navy">Related Posts</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {blogData.relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="group h-full rounded-xl border border-lightGray p-5 transition-shadow hover:shadow-md">
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="mb-2 line-clamp-2 font-semibold text-navy transition-colors group-hover:text-electricBlue">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-mediumGray">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </article>
      </main>

      <Footer />
    </div>
  );
}
