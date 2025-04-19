"use server";

import { auth } from "@/lib/firebase-admin";

export async function deleteOnFireAuth(id: string) {
  await auth.deleteUser(id);
}
