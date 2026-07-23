"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Globe, AtSign, Share2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { href: "/courses", label: "Browse Courses" },
  { href: "/about", label: "Our Instructors" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

const courseLinks = [
  { href: "/courses", label: "Web Development" },
  { href: "/courses", label: "Mobile Development" },
  { href: "/courses", label: "Data Science" },
  { href: "/courses", label: "UI/UX Design" },
];

const socialLinks = [
  { href: "#", icon: Globe, label: "Facebook" },
  { href: "#", icon: AtSign, label: "Twitter" },
  { href: "#", icon: Share2, label: "Instagram" },
  { href: "#", icon: Hash, label: "YouTube" },
];

export function Footer() {
  const [email, setEmail] = React.useState("");

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-electric-blue to-cyan">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">YK Academy</span>
            </Link>
            <p className="text-sm text-gray-400">
              Empowering students with world-class education and practical skills for the future.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gray-400 transition-colors hover:bg-electric-blue hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric-blue">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric-blue">Courses</h3>
            <ul className="space-y-2.5">
              {courseLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-electric-blue">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-electric-blue" />
                info@ykacademy.com
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-electric-blue" />
                +966 50 123 4567
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0 text-electric-blue" />
                Riyadh, Saudi Arabia
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Newsletter</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-electric-blue"
                />
                <Button size="sm" className="shrink-0" onClick={() => { if (email) { alert("Thank you for subscribing!"); setEmail(""); } }}>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} YK Academy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="text-xs text-gray-500 transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/about" className="text-xs text-gray-500 transition-colors hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
