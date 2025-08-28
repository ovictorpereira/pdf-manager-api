import fastify from "fastify";
import { getDocumentsRoute } from "../routes/get-documents.ts";
import { uploadRoute } from "../routes/upload.ts";
import { deleteByIdRoute } from "../routes/delete-by-id.ts";
import { updateLabelRoute } from "../routes/update-label.ts";

export const registerRoutes = (server: fastify.FastifyInstance) => {
  server.register(getDocumentsRoute);
  server.register(uploadRoute);
  server.register(deleteByIdRoute);
  server.register(updateLabelRoute);
};
