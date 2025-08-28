import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/db.ts";
import { tb_documents } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const updateLabelRoute: FastifyPluginAsyncZod = async (server) => {
  server.patch(
    "/update/:id",
    {
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        body: z
          .object({
            label: z.string().min(2).max(100).optional(),
          })
          .refine((data) => data.label !== undefined, {
            message: "Label is required",
          }),
        response: {
          200: z.object({
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
      const { label } = request.body;

      const documents = await db
        .select()
        .from(tb_documents)
        .where(eq(tb_documents.id, Number(id)));

      if (documents.length === 0) {
        return reply
          .status(404)
          .send({ message: "Not found any document with the provided id" });
      }

      const updateData: Record<string, string> = {};
      if (label !== undefined) updateData.label = label;

      await db
        .update(tb_documents)
        .set(updateData)
        .where(eq(tb_documents.id, Number(id)));

      reply.send({ message: "Label updated" });
    }
  );
};
