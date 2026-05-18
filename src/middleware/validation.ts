import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, ZodSchema } from "zod";

type SchemaType = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
  headers?: ZodSchema;
};

const schemaTypes: (keyof SchemaType)[] = [
  "body",
  "params",
  "query",
  "headers",
];

export const validation = (schema: SchemaType) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validationErrors: any[] = [];

      for (const key of schemaTypes) {
        if (schema[key]) {
          const result = schema[key]!.safeParse(request[key]);

          if (!result.success) {
            validationErrors.push({
              type: key,
              errors: result.error.issues,
            });
          }
        }
      }

      if (validationErrors.length > 0) {
        return reply.status(400).send({
          message: "Validation Error",
          validationErrors,
        });
      }

    } catch (error) {
      return reply.status(500).send({
        message: "Catch Error",
        error,
      });
    }
  };
};