import "fastify";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    jwt: import("@fastify/jwt").JWT;
  }

  interface FastifyRequest {
    currentUser?: {
      id: string;
      email: string;
      role: string;
    };
  }
   interface FastifyRequest {
    jwtVerify<T = any>(): Promise<T>;
  }
}