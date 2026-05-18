import { FastifyInstance } from "fastify";

import { auth } from "../../middleware/auth";
import { validation } from "../../middleware/validation";

import {
  createOrderSchema,
  orderParamsSchema,
  updateOrderStatusSchema,
} from "./orders.schema";
import { OrdersController } from "./order.controller";
import { endPoint } from "./orders.endpoint";

export default async function ordersRoutes(app: FastifyInstance) {
  // PLACE ORDER (user)
  app.post(
    "/",
    {
      preHandler: [
        auth(endPoint.all) as any,
        validation(createOrderSchema),
      ],
    },
    OrdersController.create
  );

  // MY ORDERS
  app.get(
    "/my",
    {
      preHandler: auth(endPoint.all) as any,
    },
    OrdersController.getMy
  );

  // ALL ORDERS (admin)
  app.get(
    "/",
    {
      preHandler: auth(endPoint.admin) as any,
    },
    OrdersController.getAll
  );

  // UPDATE STATUS (admin)
  app.patch(
    "/:id/status",
    {
      preHandler: [
        auth(endPoint.admin) as any,
        validation(orderParamsSchema),
        validation(updateOrderStatusSchema),
      ],
    },
    OrdersController.updateStatus
  );
}