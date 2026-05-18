import { FastifyReply, FastifyRequest } from "fastify";
import { ProductsService } from "./products.service";


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
  static async create(
    request: FastifyRequest<{
      Body: {
        title: string;
        description?: string;
        price: number;
        category?: string;
        image?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const product = await ProductsService.create(request.body);

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