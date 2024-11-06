import type { Components } from "./src/components.ts";
import type { Info } from "./src/info.ts";
import type { SourceDescription } from "./src/sourceDescription.ts";
import type { Workflow } from "./src/workflow.ts";

export type { BrandedString } from "./src/shared/common.ts";

/**
 * This is the root object of the Arazzo Description.
 */
export type ArazzoDescription = {
    /**
     * REQUIRED. This string MUST be the version number of the Arazzo Specification that the Arazzo Description uses. The arazzo field MUST be used by tooling to interpret the Arazzo Description.
     */
    arazzo: string;
    /**
     * REQUIRED. Provides metadata about the workflows contain within the Arazzo Description. The metadata MAY be used by tooling as required.
     */
    info: Info;
    /**
     * REQUIRED. A list of source descriptions (such as an OpenAPI description) this Arazzo Description SHALL apply to. The list MUST have at least one entry.
     */
    sourceDescriptions: SourceDescription[];
    /**
     * REQUIRED. A list of workflows. The list MUST have at least one entry.
     */
    workflows: Workflow[];
    /**
     * An element to hold various schemas for the Arazzo Description.
     */
    components: Components;
};
