import { FastifyReply, FastifyRequest } from "fastify";
import { ProductsService } from "./products.service";
import { supabase } from "../../config/supabase";


export class ProductsController {
  // GET /products
  static async getAll(
    request: FastifyRequest<{
      Querystring: { search?: string; category?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { search, category } = request.query;

      const products = await ProductsService.getAll({
        search,
        category,
      });

      return reply.send(products);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }

  // GET /products/:id
  static async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      const product = await ProductsService.getById(id);

      if (!product) {
        return reply.status(404).send({
          message: "Product not found",
        });
      }

      return reply.send(product);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }

  // POST /products (admin)
   static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parts = (request as any).parts();

      let title = "";
      let description = "";
      let category = "";
      let price = 0;
      let imageUrl = "";

      for await (const part of parts) {
        // TEXT FIELDS
        if (part.type === "field") {
          if (part.fieldname === "title") {
            title = String(part.value);
          }

          if (part.fieldname === "description") {
            description = String(part.value);
          }

          if (part.fieldname === "category") {
            category = String(part.value);
          }

          if (part.fieldname === "price") {
            price = Number(part.value);
          }
        }

        // FILE
        if (part.type === "file") {
          const buffer = await part.toBuffer();

          const filePath = `products/${Date.now()}-${part.filename}`;

          const { error } = await supabase.storage
            .from("products")
            .upload(filePath, buffer, {
              contentType: part.mimetype,
            });

          if (error) {
            console.error("Error uploading file:", error);
            throw new Error(error.message);
          }

          const { data } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);

          imageUrl = data.publicUrl;
        }
      }

      // VALIDATION
      if (!title) {
        return reply.status(400).send({
          message: "Title is required",
        });
      }

      if (!price || isNaN(price)) {
        return reply.status(400).send({
          message: "Valid price is required",
        });
      }

      const product = await ProductsService.create({
        title,
        description,
        category,
        price,
        image: imageUrl,
      });

      return reply.status(201).send(product);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }

  // PATCH /products/:id (admin)
  static async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<{
        title: string;
        description: string;
        price: number;
        category: string;
        image: string;
        is_active: boolean;
      }>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      const product = await ProductsService.update(id, request.body);

      return reply.send(product);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }

  // DELETE /products/:id (soft delete)
  static async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      const result = await ProductsService.delete(id);

      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }
}