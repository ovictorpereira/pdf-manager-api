import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/db.ts";
import { tb_documents } from "../db/schema.ts";
import { z } from "zod/v4";

export const getDocumentsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/",
    {
      schema: {
        response: {
          201: z.object({
            data: z.array(
              z.object({
                id: z.number(),
                label: z.string(),
                pdf_path: z.string(),
                thumb_path: z.string(),
                createdAt: z.date().or(z.string()),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const documents = await db
        .select()
        .from(tb_documents)
        .orderBy(tb_documents.id);

      return reply.send({ data: documents });
    }
  );
};
