import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { MultipartFile, MultipartValue } from "@fastify/multipart";
import { pipeline } from "stream/promises";
import * as fs from "fs";
import * as path from "path";
import z from "zod/v4";
import pdfThumbnail from "pdf-thumbnail";
import { db } from "../db/db.ts";
import { tb_documents } from "../db/schema.ts";

export const uploadRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/upload",
    {
      schema: {
        response: {
          201: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const data = await request.file();

      const documentsDir = path.resolve("documents");
      if (!fs.existsSync(documentsDir)) {
        fs.mkdirSync(documentsDir, { recursive: true });
      }

      if (!data) {
        return reply.code(400).send({
          message: "File is required",
        });
      }

      if (data.mimetype !== "application/pdf") {
        return reply.code(400).send({
          message: "File must be .pdf",
        });
      }

      const fileName = data.filename.replace(/\s+/g, "_");
      const filePath = path.join(documentsDir, fileName);
      await pipeline(data.file, fs.createWriteStream(filePath));

      // Fastify-multipart documentation:
      //  "If you cannot control the order of the placed fields,
      //  be sure to read data.fields AFTER consuming the stream,
      //  or it will only contain the fields parsed at that moment."

      const label = data.fields?.label as MultipartValue;

      const labelValue =
        label && typeof label === "object" && "value" in label
          ? ((label as MultipartValue).value as string)
          : undefined;

      if (!labelValue) {
        try {
          await fs.promises.unlink(filePath);
        } catch (error) {
          console.error("Error while trying to remove document:", error);
        }
        return reply.code(400).send({
          message: "'Label' is a required field",
        });
      }

      // Generate Thumb Image using pdf-thumbnail
      const thumbPath = filePath.replace(/\.pdf$/i, "_thumb.jpg");

      pdfThumbnail(fs.createReadStream(filePath), {
        resize: {
          width: 200,
          height: 200,
        },
      })
        .then((data) => {
          data.pipe(fs.createWriteStream(thumbPath));
        })
        .catch((err) => console.error(err));

      // DB INSERT
      await db.insert(tb_documents).values({
        label: labelValue,
        pdf_path: filePath,
        thumb_path: thumbPath,
      });

      reply.send({ message: "Success" });
    }
  );
};
