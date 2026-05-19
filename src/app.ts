import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import authRoutes from "./modules/auth/auth.routes";
import { env } from "process";
import { ApiError } from "./lib/errors";
import { ZodError } from "zod";
import productsRoutes from "./modules/products/products.routes";
import ordersRoutes from "./modules/orders/order.routes";
import multipart from "@fastify/multipart";

;
const app = Fastify({
  logger: env.NODE_ENV !== "test",
});
//  app.setErrorHandler((error, _request, reply) => {
//     if (error instanceof ApiError) {
//       return reply.status(error.statusCode).send({
//         statusCode: error.statusCode,
//         error: error.error,
//         message: error.message
//       });
//     }

//     if (error instanceof ZodError) {
//       return reply.status(400).send({
//         statusCode: 400,
//         error: "Bad Request",
//         message: error.issues.map((issue) => issue.message).join("; ")
//       });
//     }

//     const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

//     return reply.status(statusCode).send({
//       statusCode,
//       error: statusCode === 500 ? "Internal Server Error" : error.name,
//       message: statusCode === 500 ? "Unexpected server error" : error.message
//     });
//   });

//   app.setNotFoundHandler((_request, reply) =>
//     reply.status(404).send({
//       statusCode: 404,
//       error: "Not Found",
//       message: "Route not found"
//     })
//   );
app.register(cors, {
  origin: true, // or specific domains
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
app.register(multipart)
app.register(jwt, {
  secret: process.env.JWT_SECRET!,
});
app.register(authRoutes, {
  prefix: "/auth",
});

app.register(productsRoutes, {
  prefix: "/products",
});
app.register(ordersRoutes, {
  prefix: "/orders",
});
export default app;
