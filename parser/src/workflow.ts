import z from "z";
import {
    RuntimeExpression,
    Markdown,
    JsonSchema,
    FailureAction,
    Parameter,
    ReusableObject,
    SuccessAction,
    WorkflowId,
    WorkflowReference,
    LookupKey,
} from "./common.ts";
import { Step } from "./step.ts";

/**
 * A runtime expression within the context of its workflow
 */
const WorkflowExpression = RuntimeExpression;

/**
 * Describes the steps to be taken across one or more APIs to achieve an objective.
 * The workflow object MAY define inputs needed in order to execute workflow steps,
 * where the defined steps represent a call to an API operation or another workflow, and a set of outputs.
 */
export const Workflow = z
    .object({
        workflowId: WorkflowId.describe(
            "REQUIRED. Unique string to represent the workflow. The id MUST be unique amongst all workflows describe in the Arazzo Description. The workflowId value is case-sensitive. Tools and libraries MAY use the workflowId to uniquely identify a workflow, therefore, it is RECOMMENDED to follow common programming naming conventions. SHOULD conform to the regular expression [A-Za-z0-9_-]+."
        ),
        summary: z
            .string()
            .optional()
            .describe("A summary of the purpose or objective of the workflow."),
        description: Markdown.describe(
            "A description of the workflow. CommonMark syntax MAY be used for rich text representation."
        ),
        inputs: JsonSchema.optional().describe(
            "A JSON Schema 2020-12 object representing the input parameters used by this workflow."
        ),
        dependsOn: WorkflowReference.array()
            .optional()
            .describe(
                "A list of workflows that MUST be completed before this workflow can be processed. The values provided MUST be a workflowId. If the workflow depended on is defined within the current Workflow Document, then specify the workflowId of the relevant local workflow. If the workflow is defined in a separate Arazzo Document then the workflow MUST be defined in the sourceDescriptions and the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes."
            ),
        steps: Step.array().describe(
            "REQUIRED. An ordered list of steps where each step represents a call to an API operation or to another workflow."
        ),
        successActions: z
            .array(z.union([SuccessAction, ReusableObject]))
            .optional()
            .describe(
                "A list of success actions that are applicable for all steps described under this workflow. These success actions can be overridden at the step level but cannot be removed there. If a Reusable Object is provided, it MUST link to success actions defined in the components/successActions of the current Arazzo document. The list MUST NOT include duplicate success actions."
            ),
        failureActions: z
            .array(z.union([FailureAction, ReusableObject]))
            .optional()
            .describe(
                "A list of failure actions that are applicable for all steps described under this workflow. These failure actions can be overridden at the step level but cannot be removed there. If a Reusable Object is provided, it MUST link to failure actions defined in the components/failureActions of the current Arazzo document. The list MUST NOT include duplicate failure actions."
            ),
        outputs: z
            .record(LookupKey, WorkflowExpression)
            .optional()
            .describe(
                "A map between a friendly name and a dynamic output value. The name MUST use keys that match the regular expression: ^[a-zA-Z0-9.-_]+$."
            ),
        parameters: z
            .array(z.union([Parameter, ReusableObject]))
            .optional()
            .describe(
                "A list of parameters that are applicable for all steps described under this workflow. These parameters can be overridden at the step level but cannot be removed there. Each parameter MUST be passed to an operation or workflow as referenced by operationId, operationPath, or workflowId as specified within each step. If a Reusable Object is provided, it MUST link to a parameter defined in the components/parameters of the current Arazzo document. The list MUST NOT include duplicate parameters."
            ),
    })
    .strict();
export type Workflow = z.infer<typeof Workflow>;
