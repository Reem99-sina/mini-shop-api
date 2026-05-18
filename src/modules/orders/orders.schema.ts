import { z } from "zod";

export const createOrderSchema = {
  body: z.object({
    items: z.array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().min(1),
      })
    ).min(1),
  }),
};

export const orderParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const updateOrderStatusSchema = {
  body: z.object({
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  }),
};