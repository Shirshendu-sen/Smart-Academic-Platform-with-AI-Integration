"use client";

import { useParams } from "next/navigation";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import AIQuiz from "@/components/AIQuiz";
import AIChatbot from "@/components/AIChatbot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Loader2,
  PlayCircle,
  SearchX,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user, restoreAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => api.get(`/courses/${id}`).then((r) => r.data),
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", id],
    queryFn: () => api.get(`/courses/${id}/progress`).then((r) => r.data),
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: () => api.post(`/courses/${id}/enroll`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", id] });
      toast.success("Enrolled successfully!");
    },
    onError: () => toast.error("Failed to enroll."),
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) =>
      api.post(`/lessons/${lessonId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", id] });
      toast.success("Lesson marked as complete!");
    },
    onError: () => toast.error("Failed to mark lesson complete."),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <Skeleton className="mb-2 h-4 w-48" />
        <Skeleton className="mb-2 h-8 w-96" />
        <Skeleton className="mb-8 h-4 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <SearchX className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-1 font-semibold">Course not found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              This course doesn&apos;t exist or has been removed.
            </p>
            <Link href="/courses">
              <Button variant="outline" size="sm">
                Back to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/courses"
            className="transition-colors hover:text-foreground"
          >
            Courses
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground">{course.title}</span>
        </div>

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {course.title}
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {course.description}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{course.instructor?.name}</span>
                </div>
                <Badge variant="secondary">
                  {course.lessons?.length || 0} lesson
                  {(course.lessons?.length || 0) !== 1 && "s"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {user?.role === "student" && progress && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {progress.completedLessons}/{progress.totalLessons}{" "}
                      lessons
                    </span>
                  </div>
                  <Progress value={progress.percentage} />
                  <p className="text-xs text-muted-foreground">
                    {progress.percentage}% complete
                  </p>
                </div>
                {!progress.isEnrolled && (
                  <Button
                    onClick={() => enrollMutation.mutate()}
                    disabled={enrollMutation.isPending}
                    className="shrink-0"
                  >
                    {enrollMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Enroll in Course
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Lessons</CardTitle>
                <CardDescription>
                  {course.lessons?.length || 0} lessons in this course
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <ScrollArea className="h-[400px] pr-3">
                  <div className="space-y-1">
                    {course.lessons?.map((lesson: any, idx: number) => (
                      <button
                        key={lesson._id}
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all cursor-pointer",
                          activeLesson?._id === lesson._id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                            activeLesson?._id === lesson._id
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {idx + 1}
                        </div>
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {activeLesson ? (
              <motion.div
                key={activeLesson._id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {activeLesson.title}
                          </CardTitle>
                        </div>
                      </div>
                      {user?.role === "student" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            completeMutation.mutate(activeLesson._id)
                          }
                          disabled={completeMutation.isPending}
                          className="gap-1.5"
                        >
                          {completeMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed text-foreground/80">
                        {activeLesson.content || "No content yet."}
                      </p>
                    </div>

                    <Separator className="my-6" />

                    {user && (
                      <AIQuiz
                        lessonId={activeLesson._id}
                        lessonContent={activeLesson.content || ""}
                        role={user.role}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <PlayCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">
                    Select a lesson
                  </h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Choose a lesson from the sidebar to start reading and
                    learning.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {user && activeLesson && <AIChatbot lessonId={activeLesson._id} />}
      </motion.div>
    </div>
  );
}
