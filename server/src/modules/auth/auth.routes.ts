import { Elysia, Context } from "elysia";
import { auth, prisma } from "../../lib/auth";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    return {
      status: 405,
      error: "Method not allowed",
    };
  }
};

export const AuthRoutes = new Elysia().all("/api/auth/*", betterAuthView);
