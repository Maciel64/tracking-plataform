"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background p-8">
      <motion.div
        className="max-w-2xl text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-7xl font-extrabold tracking-tight text-foreground sm:text-8xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.p
          className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Página não encontrada
        </motion.p>

        <motion.p
          className="mt-4 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          A página que você está procurando não existe. Por favor, volte para o
          dashboard.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button asChild size="lg">
            <Link href="/dashboard">Voltar para dashboard</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
