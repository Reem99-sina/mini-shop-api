import { FastifyInstance } from "fastify";

import {
  register,
  login,
  me,
  forgotPassword,
  resendConfirmation,
} from "./auth.controller";
import { validation } from "../../middleware/validation";
import { loginSchema, registerSchema } from "./auth.schema";
import { auth } from "../../middleware/auth";
import { endPoint } from "./auth.endpoint";

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    {
      preHandler: validation(registerSchema),
    },
    register as any,
  );
  app.post(
    "/login",
    {
      preHandler: validation(loginSchema),
    },
    login,
  );
  app.get(
    "/me",
    {
      preHandler: auth(endPoint.user) as any,
    },
    me,
  );
  app.post("/forgot-password", forgotPassword);
  app.post("/resend-confirmation", resendConfirmation);
}
