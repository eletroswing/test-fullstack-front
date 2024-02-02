import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    ignoredRoutes: /^(?!\/admin).*/,
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};