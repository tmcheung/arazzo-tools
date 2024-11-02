import { z } from "z";
import { Markdown } from "./common.ts";

/**
 * The object provides metadata about API workflows defined in this Arazzo document. The metadata MAY be used by the clients if needed.
 */
export const Info = z
    .object({
        title: z
            .string()
            .describe(
                "REQUIRED. A human readable title of the Arazzo Description."
            ),
        summary: z
            .string()
            .optional()
            .describe("A short summary of the Arazzo Description."),
        description: Markdown.optional().describe(
            "A description of the purpose of the workflows defined. CommonMark syntax MAY be used for rich text representation."
        ),
        version: z
            .string()
            .describe(
                "REQUIRED. The version identifier of the Arazzo document (which is distinct from the Arazzo Specification version)."
            ),
    })
    .strict();
export type Info = z.infer<typeof Info>;
