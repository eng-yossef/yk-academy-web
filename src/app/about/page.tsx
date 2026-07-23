"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Heart,
  Users,
  Lightbulb,
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { GradientText } from "@/components/shared/gradient-text";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const team = [
  { name: "Ahmed Youssef", role: "Founder & Lead Instructor", initials: "AY", expertise: "Full-Stack, System Design" },
  { name: "Sara Mohamed", role: "AI & Data Science Lead", initials: "SM", expertise: "Machine Learning, NLP" },
  { name: "Omar Hassan", role: "Frontend Architect", initials: "OH", expertise: "React, Next.js, Performance" },
  { name: "Dr. Layla Abbas", role: "Deep Learning Expert", initials: "LA", expertise: "TensorFlow, Computer Vision" },
  { name: "Nour El-Din", role: "Mobile Development Lead", initials: "NE", expertise: "Flutter, React Native" },
  { name: "Karim Mansour", role: "DevOps & Cloud Instructor", initials: "KM", expertise: "AWS, Docker, Kubernetes" },
];

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We maintain the highest standards in our curriculum, ensuring every course meets industry benchmarks.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Learning is better together. We foster a supportive community where students help each other grow.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Our courses are constantly updated to reflect the latest technologies and industry best practices.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Quality education should be available to everyone, regardless of background or financial situation.",
  },
];

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Students" },
  { icon: BookOpen, value: 50, suffix: "+", label: "Courses" },
  { icon: GraduationCap, value: 20, suffix: "+", label: "Instructors" },
  { icon: Award, value: 1000, suffix: "+", label: "Certificates Issued" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-gradient pt-20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-6 border-white/10 bg-white/10 text-white">
                About YK Academy
              </Badge>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Empowering the Next Generation of{" "}
                <GradientText>Tech Leaders</GradientText>
              </h1>
              <p className="mt-6 text-lg text-gray-300 sm:text-xl">
                Our mission is to make world-class tech education accessible
                to every student in Egypt and the Middle East, bridging the
                gap between learning and industry.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <div className="relative rounded-3xl bg-lightGray/50 p-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-electricBlue/10 p-6 text-center">
                    <p className="text-3xl font-bold text-electricBlue">2019</p>
                    <p className="text-sm text-mediumGray">Founded</p>
                  </div>
                  <div className="rounded-2xl bg-cyan/10 p-6 text-center">
                    <p className="text-3xl font-bold text-cyan">6+</p>
                    <p className="text-sm text-mediumGray">Years of Impact</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-6 text-center">
                    <p className="text-3xl font-bold text-amber-600">15K+</p>
                    <p className="text-sm text-mediumGray">Alumni Network</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                    <p className="text-3xl font-bold text-emerald-600">50+</p>
                    <p className="text-sm text-mediumGray">Partner Companies</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="mb-6 text-3xl font-bold text-navy sm:text-4xl">
                Our Story
              </h2>
              <div className="space-y-4 text-mediumGray">
                <p>
                  YK Academy was founded in 2019 with a simple yet powerful
                  vision: to bridge the gap between traditional education and
                  the rapidly evolving tech industry in Egypt.
                </p>
                <p>
                  What started as a small coding bootcamp with just 15 students
                  has grown into one of Egypt&apos;s premier tech education platforms,
                  serving over 500 active students across multiple disciplines.
                </p>
                <p>
                  Our instructors are industry veterans from companies like
                  Google, Amazon, and Vodafone, bringing real-world experience
                  directly to the classroom. Every course is designed with
                  hands-on projects that mirror actual industry challenges.
                </p>
                <p>
                  We believe that talent is everywhere, but opportunity is not.
                  That&apos;s why we offer scholarships, flexible payment plans, and
                  community support to ensure everyone can access quality tech
                  education.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-lightGray/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 text-center">
              <Badge className="mb-4">Our Team</Badge>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
                Meet the <GradientText>Instructors</GradientText>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-mediumGray sm:text-lg">
                Our team of expert instructors brings decades of combined
                industry experience from top tech companies.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-lightGray bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-electricBlue to-cyan text-2xl font-bold text-white">
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-navy">{member.name}</h3>
                  <p className="text-sm font-medium text-electricBlue">
                    {member.role}
                  </p>
                  <p className="mt-2 text-sm text-mediumGray">
                    {member.expertise}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 text-center">
              <Badge className="mb-4">Our Values</Badge>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
                What We <GradientText>Stand For</GradientText>
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val, i) => (
              <FadeIn key={val.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="h-full rounded-2xl border border-lightGray p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-electricBlue/10">
                    <val.icon className="h-7 w-7 text-electricBlue" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-navy">
                    {val.title}
                  </h3>
                  <p className="text-mediumGray">{val.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-gradient py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-electricBlue/20">
                    <stat.icon className="h-7 w-7 text-electricBlue" />
                  </div>
                  <p className="text-4xl font-bold text-white">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-gray-400">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
