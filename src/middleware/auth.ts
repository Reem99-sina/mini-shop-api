import { FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase";
import { User } from "../types/user";

interface AuthenticatedRequest extends FastifyRequest {
  currentUser?: User;
  jwt<T = any>(): Promise<T>;
}

export const auth = (accessRoles: string[]) => {
  return async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const token = request.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return reply.status(401).send({ message: "No token provided" });
      }

      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        return reply.status(401).send({ message: "Invalid token" });
      }

      const userId = data.user.email;

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", userId)
        .maybeSingle();

      if (userError || !user) {
        return reply.status(404).send({ message: "User not found" });
      }

      if (!accessRoles.includes(user.role)) {
        return reply.status(403).send({ message: "Access denied" });
      }

      request.currentUser = user;
    } catch (err) {
      return reply.status(401).send({ message: "Authentication failed" });
    }
  };
};
