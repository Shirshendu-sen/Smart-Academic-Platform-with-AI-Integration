"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ArrowRight,
  User,
  GraduationCap,
  SearchX,
} from "lucide-react";
import { motion } from "motion/react";

export default function CoursesPage() {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api.get("/courses").then((r) => r.data),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-foreground">Courses</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Available Courses
            </h1>
            <p className="mt-1 text-muted-foreground">
              Explore and enroll in courses to start learning
            </p>
          </div>
          {courses && courses.length > 0 && (
            <Badge variant="secondary" className="w-fit">
              {courses.length} course{courses.length !== 1 && "s"}
            </Badge>
          )}
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-destructive/10 p-3">
                <SearchX className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-1 font-semibold">Failed to load courses</h3>
              <p className="text-sm text-muted-foreground">
                Something went wrong. Please try again later.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && courses?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">No courses yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                No courses have been published yet. Check back soon or contact
                an instructor to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && courses && courses.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any, i: number) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link href={`/courses/${course._id}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                        </div>
                        {course._count?.lessons > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {course._count.lessons} lesson
                            {course._count.lessons !== 1 && "s"}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description || "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>{course.instructor?.name || "Unknown"}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
