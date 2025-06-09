import * as motion from "motion/react-client";

import { getUserService } from "@/domain/users/user.hooks";
import { container, item } from "@/lib/motion";
import { UsersCardDescription } from "@/components/users/users-card-description";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "@/components/users/users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function UsersPage() {
  const users = getUserService().findMany();

  return (
    <div className="container py-10 overflow-x-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Usuários
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie todos os usuários do sistema
        </p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista de Usuários
              </CardTitle>

              <Suspense fallback={<Skeleton className="h-4 w-24" />}>
                <UsersCardDescription usersPromise={users} />
              </Suspense>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <UsersTable usersPromise={users} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}></motion.div>
      </motion.div>
    </div>
  );
}
