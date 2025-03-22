import { withAuth } from "next-auth/middleware";
import { pages } from "./domain/config/pages";

export default withAuth({
  pages,
});

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
