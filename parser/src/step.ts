import z from "z";
import {
    Any,
    Criterion,
    FailureAction,
    JsonPointer,
    LiteralSchema,
    LookupKey,
    Markdown,
    Parameter,
    ReusableObject,
    RuntimeExpression,
    StepId,
    SuccessAction,
    WorkflowReference,
    XPathExpression,
} from "./common.ts";

/**
 * The name of an existing, resolvable operation, as defined with a unique operationId and existing within the single sourceDescription available
 */
const OperationId = z.string();

/**
 * The name of an existing, resolvable operation, as defined with a unique operationId and existing within one of the sourceDescriptions.
 * The referenced operation will be invoked by this workflow step. If multiple (non arazzo type) sourceDescriptions are defined,
 * then the operationId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<operationId>) to avoid ambiguity or potential clashes.
 */
const OperationReference = z.union([OperationId, RuntimeExpression]);

/**
 * A reference to a Source combined with a JSON Pointer to reference an operation. This field is mutually exclusive of the operationId and workflowId fields respectively.
 * The operation being referenced MUST be described within one of the sourceDescriptions descriptions.
 * A runtime expression syntax MUST be used to identify the source description document.
 */
const OperationPath = z.string().transform((op) => ({
    source: RuntimeExpression.parse(
        op.substring(op.indexOf("{") + 1, op.indexOf("}"))
    ),
    path: JsonPointer.parse(op.substring(op.indexOf("}") + 1)),
}));

const PayloadReplacement = z
    .object({
        target: z.union([JsonPointer, XPathExpression]),
        value: z.union([LiteralSchema, RuntimeExpression]),
    })
    .strict();

/**
 * A single request body describing the Content-Type and request body content to be passed by a step to an operation.
 */
const RequestBody = z
    .object({
        contentType: z.string().optional(),
        payload: Any,
        replacements: PayloadReplacement.array().optional(),
    })
    .strict();

/**
 * A runtime expression within the context of its workflow
 */
const StepExpression = RuntimeExpression;

/**
 * Describes a single workflow step which MAY be a call to an API operation (OpenAPI Operation Object or another Workflow Object).
 */
export const Step = z
    .object({
        description: Markdown.optional().describe(
            "A description of the step. CommonMark syntax MAY be used for rich text representation."
        ),
        stepId: StepId.describe(
            "REQUIRED. Unique string to represent the step. The stepId MUST be unique amongst all steps described in the workflow. The stepId value is case-sensitive. Tools and libraries MAY use the stepId to uniquely identify a workflow step, therefore, it is RECOMMENDED to follow common programming naming conventions. SHOULD conform to the regular expression [A-Za-z0-9_-]+."
        ),
        operationId: OperationReference.optional().describe(
            "The name of an existing, resolvable operation, as defined with a unique operationId and existing within one of the sourceDescriptions. The referenced operation will be invoked by this workflow step. If multiple (non arazzo type) sourceDescriptions are defined, then the operationId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<operationId>) to avoid ambiguity or potential clashes. This field is mutually exclusive of the operationPath and workflowId fields respectively."
        ),
        operationPath: OperationPath.optional().describe(
            "A reference to a Source combined with a JSON Pointer to reference an operation. This field is mutually exclusive of the operationId and workflowId fields respectively. The operation being referenced MUST be described within one of the sourceDescriptions descriptions. A runtime expression syntax MUST be used to identify the source description document. If the referenced operation has an operationId defined then the operationId SHOULD be preferred over the operationPath."
        ),
        workflowId: WorkflowReference.optional().describe(
            "The workflowId referencing an existing workflow within the Arazzo Description. If multiple arazzo type sourceDescriptions are defined, then the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. The field is mutually exclusive of the operationId and operationPath fields respectively."
        ),
        parameters: z
            .union([Parameter, ReusableObject])
            .array()
            .optional()
            .describe(
                "A list of parameters that MUST be passed to an operation or workflow as referenced by operationId, operationPath, or workflowId. If a parameter is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a parameter defined in the components/parameters of the current Arazzo document. The list MUST NOT include duplicate parameters."
            ),
        requestBody: RequestBody.optional().describe(
            "The request body to pass to an operation as referenced by operationId or operationPath. The requestBody is fully supported in HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as GET, HEAD and DELETE), requestBody is permitted but does not have well-defined semantics and SHOULD be avoided if possible."
        ),
        successCriteria: Criterion.array()
            .optional()
            .describe(
                "A list of assertions to determine the success of the step. Each assertion is described using a Criterion Object. All assertions MUST be satisfied for the step to be deemed successful."
            ),
        onSuccess: z
            .array(z.union([SuccessAction, ReusableObject]))
            .optional()
            .describe(
                "An array of success action objects that specify what to do upon step success. If omitted, the next sequential step shall be executed as the default behavior. If multiple success actions have similar criteria, the first sequential action matching the criteria SHALL be the action executed. If a success action is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a success action defined in the components of the current Arazzo document. The list MUST NOT include duplicate success actions."
            ),
        onFailure: z
            .array(z.union([FailureAction, ReusableObject]))
            .optional()
            .describe(
                "An array of failure action objects that specify what to do upon step failure. If omitted, the default behavior is to break and return. If multiple failure actions have similar criteria, the first sequential action matching the criteria SHALL be the action executed. If a failure action is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a failure action defined in the components of the current Arazzo document. The list MUST NOT include duplicate failure actions."
            ),
        outputs: z
            .record(LookupKey, StepExpression)
            .optional()
            .describe(
                "A map between a friendly name and a dynamic output value defined using a runtime expression. The name MUST use keys that match the regular expression: ^[a-zA-Z0-9.-_]+$."
            ),
    })
    .strict();
export type Step = z.infer<typeof Step>;
