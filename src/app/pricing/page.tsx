"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

const plans = [
  {
    name: "Basic",
    price: "29",
    period: "/month",
    description: "Perfect for getting started with tech education",
    features: [
      "Access to 10 courses",
      "Basic projects & exercises",
      "Community forum access",
      "Email support",
      "Certificate of completion",
      "Mobile-friendly access",
    ],
    cta: "Start Basic Plan",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "79",
    period: "/month",
    description: "Most popular for serious learners",
    features: [
      "Access to all 50+ courses",
      "Hands-on real-world projects",
      "1-on-1 mentor sessions (2/month)",
      "Priority email & chat support",
      "Industry-recognized certificates",
      "Career placement assistance",
      "Lifetime access to materials",
      "Exclusive webinars & workshops",
    ],
    cta: "Start Professional Plan",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "199",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Everything in Professional",
      "Custom learning paths",
      "Team dashboard & analytics",
      "Dedicated account manager",
      "Custom course development",
      "API access & integrations",
      "White-label options",
      "SLA guarantee",
      "On-site training available",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-navy-gradient pt-20 pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-electricBlue/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-cyan/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <Badge className="mb-6 border-white/10 bg-white/10 text-white">
              <Sparkles className="mr-1 h-3 w-3" />
              Pricing Plans
            </Badge>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Choose Your Learning <GradientText>Plan</GradientText>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl">
              All plans include a 7-day free trial. No credit card required
              to get started.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      <main className="flex-1 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`relative flex h-full flex-col rounded-3xl border p-8 ${
                    plan.highlighted
                      ? "border-electricBlue bg-navy text-white shadow-xl shadow-electricBlue/10"
                      : "border-lightGray bg-white"
                  }`}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}

                  <h3
                    className={`text-xl font-bold ${
                      plan.highlighted ? "text-white" : "text-navy"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      plan.highlighted ? "text-gray-300" : "text-mediumGray"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-bold ${
                        plan.highlighted ? "text-white" : "text-navy"
                      }`}
                    >
                      ${plan.price}
                    </span>
                    <span
                      className={
                        plan.highlighted ? "text-gray-400" : "text-mediumGray"
                      }
                    >
                      {plan.period}
                    </span>
                  </div>

                  <Separator
                    className={`my-6 ${plan.highlighted ? "bg-white/10" : ""}`}
                  />

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          className={`mt-0.5 h-5 w-5 shrink-0 ${
                            plan.highlighted ? "text-cyan" : "text-electricBlue"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            plan.highlighted ? "text-gray-300" : "text-navy"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link href="/auth/signup">
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* FAQ */}
          <FadeIn delay={0.3}>
            <div className="mt-24 text-center">
              <h2 className="mb-4 text-2xl font-bold text-navy">
                Have Questions?
              </h2>
              <p className="mb-6 text-mediumGray">
                Check our FAQ page for detailed answers or contact our support
                team.
              </p>
              <Button variant="outline" asChild>
                <Link href="/faq">
                  View FAQ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
