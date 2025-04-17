"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Sessão verificada:", session);

    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  return null;
}
