import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import { dataRegisterUser } from "../../types/user";

// REGISTER
export const register = async (
  request: FastifyRequest<{ Body: dataRegisterUser }>,
  reply: FastifyReply,
) => {
  try {
    const user = await AuthService.register(request.body as any);
    console.log("Registered user:", user);
    // const result = await AuthService.resendConfirmation(user?.email);

    // return reply.status(200).send(result);
    return reply.status(201).send({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return reply.status(400).send({
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authData = await AuthService.login(request.body as any);

    return reply.status(200).send({
      message: "Login successful",
      data: authData,
    });
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message,
    });
  }
};

// ME (CURRENT USER)
export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = (request as any).currentUser?.id;

    if (!userId) {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }

    const user = await AuthService.getMe(userId);

    return reply.status(200).send({
      user,
    });
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message,
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { email } = request.body as any;

    const result = await AuthService.forgotPassword(email);

    return reply.status(200).send(result);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message,
    });
  }
};

export const resendConfirmation = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { email } = request.body as any;

    const result = await AuthService.resendConfirmation(email);

    return reply.status(200).send(result);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message,
    });
  }
};
