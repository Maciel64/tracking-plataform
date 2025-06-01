import { User as TUser } from "@/domain/users/user.model";
import { auth } from "@/auth";

export async function User() {
  const session = await auth();

  return {
    ...(session?.user as TUser),
  };
}
