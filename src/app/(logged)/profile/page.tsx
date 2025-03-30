import { User } from "@/components/server/user";
import { PerfilPage } from "./client";

export default async function ProfilePage() {
  const user = await User();

  return <PerfilPage user={user} />;
}
