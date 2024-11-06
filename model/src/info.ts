import type { Markdown } from "./shared/common.ts";

/**
 * The object provides metadata about API workflows defined in this Arazzo document. The metadata MAY be used by the clients if needed.
 */
export type Info = {
    /**
     * REQUIRED. A human readable title of the Arazzo Description.
     */
    title: string;
    /**
     * REQUIRED. The version identifier of the Arazzo document (which is distinct from the Arazzo Specification version).
     */
    version: string;
    /**
     * A short summary of the Arazzo Description.
     */
    summary?: string;
    /**
     * A description of the purpose of the workflows defined. CommonMark syntax MAY be used for rich text representation.
     */
    description?: Markdown;
};
