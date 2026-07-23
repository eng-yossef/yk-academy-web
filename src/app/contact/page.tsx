"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "info@ykacademy.com",
    description: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+966 50 123 4567",
    description: "Sun–Thu, 9AM–6PM",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Riyadh, Saudi Arabia",
    description: "123 Education Street",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Sun – Thu",
    description: "9:00 AM – 6:00 PM",
  },
];

export default function ContactPage() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-navy-gradient pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-3 max-w-xl text-gray-300 sm:text-lg">
              Have a question or want to learn more? We&apos;d love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      <main className="flex-1 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Contact info cards */}
          <FadeIn>
            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="rounded-2xl border border-lightGray p-6 text-center transition-shadow hover:shadow-md"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-electricBlue/10">
                    <info.icon className="h-6 w-6 text-electricBlue" />
                  </div>
                  <h3 className="font-semibold text-navy">{info.title}</h3>
                  <p className="mt-1 text-sm font-medium text-navy">
                    {info.value}
                  </p>
                  <p className="text-xs text-mediumGray">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <FadeIn delay={0.1} className="lg:col-span-2">
              <div className="rounded-3xl border border-lightGray p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-navy">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-mediumGray">
                      Thank you for reaching out. We&apos;ll get back to you within
                      24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="mb-6 text-2xl font-bold text-navy">
                      Send us a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          label="Full Name"
                          placeholder="John Doe"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          label="Phone (optional)"
                          type="tel"
                          placeholder="+966 50 123 4567"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                        <Input
                          label="Subject"
                          placeholder="How can we help?"
                          required
                          value={form.subject}
                          onChange={(e) =>
                            setForm({ ...form, subject: e.target.value })
                          }
                        />
                      </div>
                      <Textarea
                        label="Message"
                        placeholder="Tell us more about your inquiry..."
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                      />
                      <Button type="submit" size="lg" className="px-8">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </FadeIn>

            {/* Map & WhatsApp */}
            <FadeIn delay={0.2} className="space-y-6">
              {/* Map placeholder */}
              <div className="rounded-3xl border border-lightGray overflow-hidden">
                <div className="flex h-64 items-center justify-center bg-lightGray/50 text-mediumGray">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-electricBlue/40" />
                    <p className="text-sm">Google Maps</p>
                    <p className="text-xs text-mediumGray/60">
                      Riyadh, Saudi Arabia
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 transition-colors hover:bg-emerald-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-navy">
                    Chat on WhatsApp
                  </p>
                  <p className="text-sm text-mediumGray">
                    Quick response guaranteed
                  </p>
                </div>
              </a>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
