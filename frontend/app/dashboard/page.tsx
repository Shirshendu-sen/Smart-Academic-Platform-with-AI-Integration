"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";

export default function DashboardPage() {
  const { user, restoreAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) router.push("/login");
  }, [router]);

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    {
      href: "/courses",
      icon: BookOpen,
      title: "Browse Courses",
      description: "Explore all available courses and enroll in new ones.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      show: true,
    },
    {
      href: "/instructor",
      icon: GraduationCap,
      title: "Instructor Panel",
      description: "Create and manage your courses, lessons, and quizzes.",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      show: user.role === "instructor" || user.role === "admin",
    },
    {
      href: "/admin",
      icon: ShieldCheck,
      title: "Admin Portal",
      description: "Manage users and platform settings.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      show: user.role === "admin",
    },
  ].filter((a) => a.show);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {greeting()}, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Welcome to your dashboard. Here&apos;s your overview.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit gap-1.5 capitalize">
              <Sparkles className="h-3 w-3" />
              {user.role}
            </Badge>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Account role:{" "}
                  <span className="capitalize font-medium text-foreground">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            Jump into what you need
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Link href={action.href}>
                <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex rounded-lg p-2.5 ${action.bg}`}
                      >
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
