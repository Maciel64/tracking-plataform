import { User as TUser } from "@/@types/user";
import { auth } from "@/auth";

export async function User() {
  const session = await auth();

  return {
    ...(session?.user as TUser),
  };
}
