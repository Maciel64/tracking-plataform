"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mt-32 flex items-center justify-center bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-2 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-foreground lg:text-9xl">
            Error 500
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Um erro aconteceu
          </p>
          <p className="mb-4 text-lg font-light text-muted-foreground">
            {error.message ||
              "Não se preocupe, o problema é aqui do nosso lado, estamos trabalhando para resolver"}
          </p>
          <div className="space-x-4">
            <Button onClick={() => reset()}>Tentar novamente</Button>
            <Button variant={"outline"}>
              <Link href="/dashboard">Voltar para dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
