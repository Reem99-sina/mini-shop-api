import { z } from "zod";

// CREATE product
export const createProductSchema = {
  body: z.object({
    title: z.string().min(1, "Title is required"),

    description: z.string().optional(),

    price: z.number({
      error: "Price must be a number"
    }).positive("Price must be greater than 0"),

    category: z.string().optional(),

    image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  }),
};

// UPDATE product (partial)
export const updateProductSchema = {
  body: z.object({
    title: z.string().min(1).optional(),

    description: z.string().optional(),

    price: z.number().positive().optional(),

    category: z.string().optional(),

    image: z.string().url("Invalid image URL").optional().or(z.literal("")),

    is_active: z.boolean().optional(),
  }),
};

// GET ALL products (query)
export const productQuerySchema = {
  query: z.object({
    search: z.string().optional(),

    category: z.string().optional(),
  }),
};

// GET / DELETE by id
export const productParamsSchema = {
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
};