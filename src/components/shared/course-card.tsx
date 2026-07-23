"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  image: string;
  category: string;
  title: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  duration?: string;
  students?: number;
  onEnroll?: () => void;
  className?: string;
}

export function CourseCard({
  image,
  category,
  title,
  instructor,
  rating,
  reviewCount,
  price,
  originalPrice,
  duration,
  students,
  onEnroll,
  className,
}: CourseCardProps) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border border-light-gray bg-white shadow-sm transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="default">{category}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-navy line-clamp-2 group-hover:text-electric-blue transition-colors">
          {title}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">by {instructor}</p>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-navy">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()})</span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </div>
          )}
          {students !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {students.toLocaleString()} students
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-light-gray pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-navy">${price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>
            )}
          </div>
          <Button size="sm" onClick={onEnroll}>
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}
