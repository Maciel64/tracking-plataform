import { PerfilPage } from "./client";
import { auth } from "@/auth";
import { User } from "@/domain/users/user.model";

export default async function ProfilePage() {
  const user = await auth();

  return <PerfilPage user={user?.user as User} />;
}
