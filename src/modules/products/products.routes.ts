import { FastifyInstance } from "fastify";
import { validation } from "../../middleware/validation";
import { ProductsController } from "./products.controller";
import { auth } from "../../middleware/auth";
import {
  createProductSchema,
  productParamsSchema,
  productQuerySchema,
  updateProductSchema,
} from "./products.schema";
import { endPoint } from "./products.endpoint";

export default async function productsRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { search?: string; category?: string } }>(
    "/",
    {
      preHandler: validation(productQuerySchema),
    },
    ProductsController.getAll,
  );
  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: validation(productParamsSchema),
    },
    ProductsController.getById,
  );

  app.post(
    "/",
    { preHandler: [auth(endPoint.admin) as any] },
    ProductsController.create,
  );
  app.patch(
    "/:id",
    { preHandler: [auth(endPoint.admin) as any, validation(updateProductSchema)] },
    ProductsController.update,
  );
  app.delete(
    "/:id",
    { preHandler: [auth(endPoint.admin) as any, validation(productParamsSchema)] },
    ProductsController.delete,
  );
}
