import type { RuntimeExpression } from "./common.ts";

type Locations = "path" | "query" | "header" | "cookie" | "body";

abstract class AbstractParameter {
    constructor(
        /**
         * The name of the parameter. Parameter names are case sensitive.
         */
        public name: string,
        /**
         * The value to pass in the parameter. The value can be a constant or an Runtime Expression to be evaluated and passed to the referenced operation or workflow.
         */
        // deno-lint-ignore no-explicit-any
        public value: RuntimeExpression | any,
        /**
         * The name location of the parameter. Also known as the property 'in'.
         * There are four possible locations specified by the in field:
         * path - Used together with OpenAPI style Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in /items/{itemId}, the path parameter is itemId.
         * query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id.
         * header - Custom headers that are expected as part of the request. Note that RFC7230 states header names are case insensitive.
         * cookie - Used to pass a specific cookie value to the source API.
         * When the step in context specifies a workflowId, then all parameters map to workflow inputs. In all other scenarios (e.g., a step specifies an operationId), the in field MUST be specified.
         */
        public location?: Locations
    ) {}
}

/**
 * Describes a single step parameter with value as a runtime expression.
 */
export class ExpressionParameter extends AbstractParameter {
    constructor(
        name: string,
        public value: RuntimeExpression,
        location?: Locations
    ) {
        super(name, value, location);
    }
}

/**
 * Describes a single step parameter with value as any constant.
 */
export class AnyParameter extends AbstractParameter {
    constructor(
        name: string,
        // deno-lint-ignore no-explicit-any
        public value: any,
        location?: Locations
    ) {
        super(name, value, location);
    }
}

/**
 * Describes a single step parameter.
 */
export type Parameter = ExpressionParameter | AnyParameter;
