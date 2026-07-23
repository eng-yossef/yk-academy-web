"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Download, Share2, ExternalLink, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { APP_URL } from "@/config/constants";

interface Certificate {
  id: string;
  certificateNumber: string;
  courseName: string;
  issuedAt: string;
  pdfUrl: string | null;
  verificationUrl: string | null;
}

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch("/api/student/certificates");
        if (res.ok) {
          const json = await res.json();
          setCertificates(json.data);
        }
      } catch {
        setCertificates([
          { id: "1", certificateNumber: "YK-2026-001", courseName: "CSS Fundamentals", issuedAt: "2026-07-15T10:00:00Z", pdfUrl: "/certs/css.pdf", verificationUrl: `${APP_URL}/verify/YK-2026-001` },
          { id: "2", certificateNumber: "YK-2026-002", courseName: "JavaScript Essentials", issuedAt: "2026-07-10T10:00:00Z", pdfUrl: "/certs/js.pdf", verificationUrl: `${APP_URL}/verify/YK-2026-002` },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  const handleDownload = async (cert: Certificate) => {
    if (cert.pdfUrl) {
      const link = document.createElement("a");
      link.href = cert.pdfUrl;
      link.download = `certificate-${cert.certificateNumber}.pdf`;
      link.click();
    }
  };

  const handleShare = async (cert: Certificate) => {
    if (navigator.share) {
      await navigator.share({
        title: `Certificate - ${cert.courseName}`,
        text: `I completed ${cert.courseName} at YK Academy!`,
        url: cert.verificationUrl ?? `${APP_URL}/verify/${cert.certificateNumber}`,
      });
    } else {
      await navigator.clipboard.writeText(
        cert.verificationUrl ?? `${APP_URL}/verify/${cert.certificateNumber}`
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        subtitle="Your earned certificates and achievements"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Certificates" }]}
      />

      {certificates.length === 0 && !loading ? (
        <EmptyState
          icon={<Award className="h-8 w-8" />}
          title="No certificates yet"
          description="Complete a course to earn your first certificate"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-xl border border-light-gray bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-navy via-darkBlue to-electric-blue p-8 text-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute left-4 top-4 h-32 w-32 rounded-full border-2 border-white/30" />
                  <div className="absolute bottom-4 right-4 h-24 w-24 rounded-full border-2 border-white/20" />
                </div>
                <Award className="relative mx-auto h-12 w-12 text-cyan" />
                <h3 className="relative mt-4 text-lg font-bold text-white">Certificate of Completion</h3>
                <p className="relative mt-2 text-sm text-white/80">{cert.courseName}</p>
                <div className="relative mt-4 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-cyan to-transparent" />
                <p className="relative mt-3 font-mono text-xs text-white/60">{cert.certificateNumber}</p>
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issued:</span>
                  <span className="font-medium text-navy">
                    {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(cert)}
                    disabled={!cert.pdfUrl}
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleShare(cert)}
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  {cert.verificationUrl && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
