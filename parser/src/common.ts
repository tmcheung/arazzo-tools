import z from "z";

export const Any = z.any();

/**
 * Lookup key for Maps. The keys must match the regex "^[a-zA-Z0-9\.\-_]+$"
 */
export const LookupKey = z
    .string()
    .refine((val) => /^[a-zA-Z0-9\.\-_]+$/.test(val), {
        message: "Lookup keys must match the regex '^[a-zA-Z0-9.-_]+$'",
    });

/**
 * CommonMark syntax MAY be used for rich text representation.
 */
export const Markdown = z.string();

/**
 * MUST be in the form of a URI-reference as defined by RFC3986
 */
export const RelativeUrl = z.string();

export const Url = z
    .string()
    .url()
    .transform((url) => new URL(url));

export const LiteralSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
]);
type Literal = z.infer<typeof LiteralSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
    z.union([LiteralSchema, z.array(JsonSchema), z.record(JsonSchema)])
);

export const JsonPointer = z.string();
export const JsonPath = z.string();
export const XPathExpression = z.string();
export const Regex = z.string();

/**
 * A runtime expression allows values to be defined based on information that will be available within an HTTP message,
 * an event message, and within objects serialized from the Arazzo document such as workflows or steps.
 */
export const RuntimeExpression = z.string();

/**
 * An object used to describe the type and version of an expression used within a Criterion Object. If this object is not defined, then the following defaults apply:
 * JSONPath as described by RFC9535
 * XPath as described by XML Path Language 3.1
 * Defining this object gives the ability to utilize tooling compatible with older versions of either JSONPath or XPath.
 */
const CriterionExpressionType = z.union([
    z
        .object({
            type: z.literal("jsonpath"),
            version: z.literal("draft-goessner-dispatch-jsonpath-00"),
        })
        .strict(),
    z
        .object({
            type: z.literal("xpath"),
            version: z.union([
                z.literal("xpath-30"),
                z.literal("xpath-20"),
                z.literal("xpath-10"),
            ]),
        })
        .strict(),
]);

const SimpleCondition = z.string();

/**
 * Conditions can be simple (e.g. $statusCode == 200 which applies an operator on a value obtained from a runtime expression), or a regex, or a JSONPath expression.
 */
const Condition = z.union([SimpleCondition, Regex, JsonPath]);

/**
 * An object used to specify the context, conditions, and condition types that can be used to prove or satisfy assertions specified in Step Object successCriteria, Success Action Object criteria, and Failure Action Object criteria.
 */
export const Criterion = z
    .object({
        context: RuntimeExpression.optional(),
        condition: Condition,
        type: z
            .union([
                z.literal("simple"),
                z.literal("regex"),
                z.literal("jsonpath"),
                z.literal("xpath"),
                CriterionExpressionType,
            ])
            .default("simple"),
    })
    .strict();

/**
 * Unique string to represent the workflow. The id MUST be unique amongst all workflows describe in the Arazzo Description. The workflowId value is case-sensitive.
 * Tools and libraries MAY use the workflowId to uniquely identify a workflow, therefore, it is RECOMMENDED to follow common programming naming conventions.
 * SHOULD conform to the regular expression [A-Za-z0-9_\-]+.
 */
export const WorkflowId = z.string();

/**
 * The values provided MUST be a workflowId. If the workflow depended on is defined within the current Workflow Document,
 * then specify the workflowId of the relevant local workflow.
 *
 * If the workflow is defined in a separate Arazzo Document then the workflow MUST be defined in the sourceDescriptions
 * and the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes.
 */
export const WorkflowReference = z.union([WorkflowId, RuntimeExpression]);

/**
 * Unique string to represent the step. The stepId MUST be unique amongst all steps described in the workflow. The stepId value is case-sensitive.
 * Tools and libraries MAY use the stepId to uniquely identify a workflow step, therefore, it is RECOMMENDED to follow common programming naming conventions.
 * SHOULD conform to the regular expression [A-Za-z0-9_\-]+.
 */
export const StepId = z.string();

/**
 * A single success action which describes an action to take upon success of a workflow step. There are two possible values for the type field:
 * end - The workflow ends, and context returns to the caller with applicable outputs
 * goto - A one-way transfer of workflow control to the specified label (either a workflowId or stepId)
 */
export const SuccessAction = z
    .object({
        name: z.string(),
        type: z.union([z.literal("end"), z.literal("goto")]),
        workflowId: WorkflowReference.optional(),
        stepId: StepId.optional(),
        criteria: Criterion.array().optional(),
    })
    .strict();

/**
 * A single failure action which describes an action to take upon failure of a workflow step. There are three possible values for the type field:
 * end - The workflow ends, and context returns to the caller with applicable outputs
 * retry - The current step will be retried. The retry will be constrained by the retryAfter and retryLimit fields. If a stepId or workflowId are specified, then the reference is executed and the context is returned, after which the current step is retried.
 * goto - A one-way transfer of workflow control to the specified label (either a workflowId or stepId)
 */
export const FailureAction = z
    .object({
        name: z.string(),
        type: z.union([
            z.literal("end"),
            z.literal("retry"),
            z.literal("goto"),
        ]),
        workflowId: WorkflowReference.optional(),
        stepId: StepId.optional(),
        retryAfter: z.number().gte(0).optional(),
        retryLimit: z.number().int(),
        criteria: Criterion.array().optional(),
    })
    .strict();

/**
 * Describes a single step parameter. A unique parameter is defined by the combination of a name and in fields. There are four possible locations specified by the in field:
 * path - Used together with OpenAPI style Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in /items/{itemId}, the path parameter is itemId.
 * query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id.
 * header - Custom headers that are expected as part of the request. Note that RFC7230 states header names are case insensitive.
 * cookie - Used to pass a specific cookie value to the source API.
 */
export const Parameter = z
    .object({
        name: z.string(),
        in: z.string().optional(),
        value: z.union([Any, RuntimeExpression]),
    })
    .strict();

/**
 * A simple object to allow referencing of objects contained within the Components Object.
 * It can be used from locations within steps or workflows in the Arazzo Description.
 * Note - Input Objects MUST use standard JSON Schema referencing via the $ref keyword while all non JSON Schema objects use this object and its expression based referencing mechanism.
 */
export const ReusableObject = z
    .object({
        reference: RuntimeExpression,
        value: Any.optional(),
    })
    .strict();
