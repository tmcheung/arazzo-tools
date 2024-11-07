import type { RelativeUrl } from "./shared/common.ts";

/**
 * Describes a source description (such as an OpenAPI description) that will be referenced by one or more workflows described within an Arazzo Description.
 * An object storing a map between named description keys and location URLs to the source descriptions (such as an OpenAPI description) this Arazzo Description SHALL apply to.
 * Each source location string MUST be in the form of a URI-reference as defined by RFC3986.
 */
export type SourceDescription = {
    /**
     * REQUIRED. A unique name for the source description. Tools and libraries MAY use the name to uniquely identify a source description, therefore, it is RECOMMENDED to follow common programming naming conventions. SHOULD conform to the regular expression [A-Za-z0-9_-]+.
     */
    name: string;
    /**
     * REQUIRED. A URL to a source description to be used by a workflow. If a relative reference is used, it MUST be in the form of a URI-reference as defined by RFC3986.
     */
    url: URL | RelativeUrl;
    /**
     * The type of source description. Possible values are 'openapi' or 'arazzo'.
     */
    type?: "openapi" | "arazzo";
};
