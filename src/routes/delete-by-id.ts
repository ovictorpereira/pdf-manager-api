import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/db.ts";
import { tb_documents } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import * as path from "node:path";
import * as fs from "node:fs";

export const deleteByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/remove/:id",
    {
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const document = await db
        .select()
        .from(tb_documents)
        .where(eq(tb_documents.id, Number(id)));

      if (document.length === 0) {
        return reply
          .status(404)
          .send({ message: "Not found any document with the provided id" });
      }

      await db.delete(tb_documents).where(eq(tb_documents.id, Number(id)));

      try {
        const pdfPath = path.resolve(document[0].pdf_path);
        const thumbPath = path.resolve(document[0].thumb_path);

        await Promise.all([
          fs.promises.unlink(pdfPath),
          fs.promises.unlink(thumbPath),
        ]);
      } catch (error) {
        console.error("Error while trying to remove document:", error);
      }

      reply.send({ message: "Document deleted" });
    }
  );
};
