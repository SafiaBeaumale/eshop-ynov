"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface StaticPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export function StaticPage({
  title,
  description,
  icon: Icon,
  children,
}: StaticPageProps) {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex p-6 rounded-full bg-primary/10 mb-6"
            >
              <Icon className="h-12 w-12 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
