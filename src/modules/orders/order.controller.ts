import { FastifyReply, FastifyRequest } from "fastify";
import { OrdersService } from "./order.service";


export class OrdersController {
  // POST /orders
  static async create(request: any, reply: FastifyReply) {
    try {
      const userId = request.currentUser.id;

      const order = await OrdersService.create(userId, request.body.items);

      return reply.status(201).send(order);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }

  // GET /orders/my
  static async getMy(request: any, reply: FastifyReply) {
    try {
      const userId = request.currentUser.id;

      const orders = await OrdersService.getMyOrders(userId);

      return reply.send(orders);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }

  // GET /orders (admin)
  static async getAll(request: any, reply: FastifyReply) {
    try {
      const { page, limit } = request.query;

      const orders = await OrdersService.getAll(page, limit);

      return reply.send(orders);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }

  // PATCH /orders/:id/status
  static async updateStatus(request: any, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { status } = request.body;

      const order = await OrdersService.updateStatus(id, status);

      return reply.send(order);
    } catch (err: any) {
      return reply.status(400).send({
        message: err.message,
      });
    }
  }
}