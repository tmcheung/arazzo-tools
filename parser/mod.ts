import { z } from "z";
import { Components } from "./src/components.ts";
import { Info } from "./src/info.ts";
import { SourceDescription } from "./src/sourceDescription.ts";
import { Workflow } from "./src/workflow.ts";

/**
 * This is the root object of the Arazzo Description.
 */
export const ArazzoDescription = z.object({
    arazzo: z
        .string()
        .describe(
            "REQUIRED. This string MUST be the version number of the Arazzo Specification that the Arazzo Description uses. The arazzo field MUST be used by tooling to interpret the Arazzo Description."
        ),
    info: Info.describe(
        "REQUIRED. Provides metadata about the workflows contain within the Arazzo Description. The metadata MAY be used by tooling as required."
    ),
    sourceDescriptions: SourceDescription.array()
        .min(1)
        .describe(
            "REQUIRED. A list of source descriptions (such as an OpenAPI description) this Arazzo Description SHALL apply to. The list MUST have at least one entry."
        ),
    workflows: Workflow.array()
        .min(1)
        .describe(
            "REQUIRED. A list of workflows. The list MUST have at least one entry."
        ),
    components: Components.describe(
        "An element to hold various schemas for the Arazzo Description."
    ),
});
export type ArazzoDescription = z.infer<typeof ArazzoDescription>;
