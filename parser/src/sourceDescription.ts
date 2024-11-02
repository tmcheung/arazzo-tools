import z from "z";
import { Url, RelativeUrl } from "./common.ts";

/**
 * Describes a source description (such as an OpenAPI description) that will be referenced by one or more workflows described within an Arazzo Description.
 * An object storing a map between named description keys and location URLs to the source descriptions (such as an OpenAPI description) this Arazzo Description SHALL apply to.
 * Each source location string MUST be in the form of a URI-reference as defined by RFC3986.
 */
export const SourceDescription = z
    .object({
        name: z
            .string()
            .describe(
                "REQUIRED. A unique name for the source description. Tools and libraries MAY use the name to uniquely identify a source description, therefore, it is RECOMMENDED to follow common programming naming conventions. SHOULD conform to the regular expression [A-Za-z0-9_-]+."
            ),
        url: z
            .union([Url, RelativeUrl])
            .describe(
                "REQUIRED. A URL to a source description to be used by a workflow. If a relative reference is used, it MUST be in the form of a URI-reference as defined by RFC3986."
            ),
        type: z
            .union([z.literal("openapi"), z.literal("arazzo")])
            .optional()
            .describe(
                "The type of source description. Possible values are 'openapi' or 'arazzo'."
            ),
    })
    .strict();
export type SourceDescription = z.infer<typeof SourceDescription>;
