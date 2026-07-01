"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  ChartBar,
  GraduationCap,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Quiz Generator",
    description:
      "Auto-generate multiple-choice questions from lecture notes in seconds using advanced AI.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Bot,
    title: "AI Doubt Chatbot",
    description:
      "Get instant answers to your questions, grounded in your specific course material.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: ChartBar,
    title: "Progress Analytics",
    description:
      "Personalized feedback, completion tracking, and risk detection from your AI advisor.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const stats = [
  { label: "AI-Powered Quizzes", value: "Instant" },
  { label: "Doubt Resolution", value: "24/7" },
  { label: "Progress Tracking", value: "Real-time" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center py-20 text-center sm:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Learning Platform
              </Badge>
            </motion.div>

            <motion.h1
              className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Learn smarter with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI-powered
              </span>{" "}
              education
            </motion.h1>

            <motion.p
              className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              AI-generated quizzes, instant doubt resolution, and personalized
              progress analysis — all in one platform designed for modern learners.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/register">
                <Button size="xl" className="gap-2 text-base">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="xl" className="gap-2 text-base">
                  <BookOpen className="h-4 w-4" />
                  Browse Courses
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-foreground sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to excel
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Powered by AI to make learning personalized, interactive, and effective.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="group relative overflow-hidden transition-shadow hover:shadow-md h-full">
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 inline-flex rounded-lg p-2.5 ${feature.bg}`}
                    >
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 -z-10 opacity-20">
              <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
            </div>
            <GraduationCap className="mx-auto mb-6 h-12 w-12" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your learning?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Join SmartLMS today and experience the future of AI-powered education.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="xl"
                  variant="secondary"
                  className="gap-2 text-base"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">SmartLMS</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/courses" className="transition-colors hover:text-foreground">
              Courses
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground">
              Log in
            </Link>
            <Link href="/register" className="transition-colors hover:text-foreground">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
