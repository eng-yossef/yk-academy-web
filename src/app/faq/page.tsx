"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GradientText } from "@/components/shared/gradient-text";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

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

const faqCategories = [
  "All",
  "General",
  "Courses",
  "Pricing & Payment",
  "Account & Technical",
  "Certificates",
];

const faqs: Record<string, Array<{ question: string; answer: string }>> = {
  General: [
    {
      question: "What is YK Academy?",
      answer:
        "YK Academy is an online learning platform focused on technology and programming education. We offer courses in web development, AI, mobile development, and more, taught by industry professionals.",
    },
    {
      question: "Who can enroll in your courses?",
      answer:
        "Anyone can enroll! Whether you're a complete beginner, a student looking to specialize, or a professional wanting to upskill, our courses are designed to accommodate all levels.",
    },
    {
      question: "What languages are your courses in?",
      answer:
        "Most of our courses are in English with Arabic subtitles. Some courses are fully in Arabic. We plan to add more Arabic-language content in the future.",
    },
  ],
  Courses: [
    {
      question: "How many courses are available?",
      answer:
        "We currently offer 50+ courses across programming, AI & data science, web development, mobile development, and design. We regularly add new courses based on student demand and industry trends.",
    },
    {
      question: "Do I need prior programming experience?",
      answer:
        "Not at all! Many of our courses are designed for absolute beginners. Each course clearly indicates its level (Beginner, Intermediate, Advanced) so you can choose what's right for you.",
    },
    {
      question: "How long do I have access to a course?",
      answer:
        "Once you enroll in a course, you get lifetime access to all course materials, including any future updates. You can learn at your own pace and revisit lessons anytime.",
    },
    {
      question: "Are the courses self-paced?",
      answer:
        "Yes! All courses are 100% self-paced. You can start, pause, and resume learning whenever it suits your schedule. There are no deadlines or time limits.",
    },
  ],
  "Pricing & Payment": [
    {
      question: "How much do courses cost?",
      answer:
        "Individual courses range from $29 to $99. Our subscription plans offer better value: Basic ($29/mo for 10 courses), Professional ($79/mo for all courses + mentorship), and Enterprise ($199/mo for teams).",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards (Visa, Mastercard), PayPal, bank transfers, and mobile payment methods including Vodafone Cash, InstaPay, and Fawry.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee on all courses and plans. If you're not satisfied with the quality, contact our support team for a full refund.",
    },
    {
      question: "Are there scholarships available?",
      answer:
        "Yes! We offer merit-based scholarships covering up to 100% of course fees for outstanding students who demonstrate financial need. Apply through our scholarship page.",
    },
  ],
  "Account & Technical": [
    {
      question: "How do I create an account?",
      answer:
        "Click 'Sign Up' in the top navigation. You can register with your email or sign in directly using Google or GitHub. The process takes less than a minute.",
    },
    {
      question: "Can I access courses on mobile?",
      answer:
        "Absolutely. Our platform is fully responsive and works on all devices — phones, tablets, and desktops. You can even download course materials for offline viewing.",
    },
    {
      question: "I forgot my password. What do I do?",
      answer:
        "Click 'Forgot Password' on the sign-in page, enter your email, and follow the reset link sent to your inbox. If you signed up via Google/GitHub, use those to sign in.",
    },
  ],
  Certificates: [
    {
      question: "Do I get a certificate upon completion?",
      answer:
        "Yes! Upon completing a course, you'll receive a professional certificate that you can share on LinkedIn, include in your resume, or present to employers.",
    },
    {
      question: "Are the certificates recognized by employers?",
      answer:
        "Our certificates are recognized by our network of 50+ partner companies across Egypt and the Middle East. Many of our graduates have been hired by top tech firms after completing our programs.",
    },
  ],
};

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const [search, setSearch] = React.useState("");

  const displayFaqs = React.useMemo(() => {
    let items: Array<{ question: string; answer: string; category: string }> =
      [];

    if (selectedCategory === "All") {
      Object.entries(faqs).forEach(([cat, catFaqs]) => {
        catFaqs.forEach((f) => items.push({ ...f, category: cat }));
      });
    } else {
      const catFaqs = faqs[selectedCategory] || [];
      items = catFaqs.map((f) => ({ ...f, category: selectedCategory }));
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }

    return items;
  }, [selectedCategory, search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-navy-gradient pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Frequently Asked <GradientText>Questions</GradientText>
            </h1>
            <p className="mt-3 max-w-xl text-gray-300 sm:text-lg">
              Find answers to common questions about our platform, courses, and
              services.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-8 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-mediumGray" />
                <Input
                  placeholder="Search questions..."
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <FadeIn>
            <div className="mb-10 flex flex-wrap gap-2">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenIndex(0);
                  }}
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

          {/* Accordion */}
          <div className="space-y-4">
            {displayFaqs.map((faq, i) => (
              <FadeIn key={`${faq.category}-${i}`} delay={i * 0.03}>
                <div className="overflow-hidden rounded-2xl border border-lightGray">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === i ? null : i)
                    }
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div>
                      <span className="mr-2 rounded-full bg-electricBlue/10 px-2.5 py-0.5 text-xs font-medium text-electricBlue">
                        {faq.category}
                      </span>
                      <span className="text-lg font-semibold text-navy">
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 shrink-0 text-electricBlue" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === i ? "auto" : 0,
                      opacity: openIndex === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-mediumGray leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              </FadeIn>
            ))}
          </div>

          {displayFaqs.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-navy">
                No questions found
              </p>
              <p className="mt-1 text-mediumGray">
                Try a different search term or category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
