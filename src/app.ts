import fastify from "fastify";
import multipart from "@fastify/multipart";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { registerRoutes } from "./startup/routes.ts";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

// Fastify Zod setup
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(multipart, {
  attachFieldsToBody: false,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Load routes
registerRoutes(server);

export { server };
