import type {
    JsonSchema,
    LookupKey,
    ReusableObject,
    RuntimeExpression,
    WorkflowId,
} from "./shared/common.ts";
import type { Markdown } from "./shared/common.ts";
import type { WorkflowReference } from "./shared/common.ts";
import type { FailureAction } from "./shared/failureActions.ts";
import type { Parameter } from "./shared/parameter.ts";
import type { SuccessAction } from "./shared/successActions.ts";
import type { Step } from "./step.ts";

// /**
//  * A runtime expression within the context of a workflow
//  */
export type WorkflowExpression = RuntimeExpression;

// /**
//  * Describes the steps to be taken across one or more APIs to achieve an objective.
//  * The workflow object MAY define inputs needed in order to execute workflow steps,
//  * where the defined steps represent a call to an API operation or another workflow, and a set of outputs.
//  */
export type Workflow = {
    /**
     * REQUIRED. Unique string to represent the workflow. The id MUST be unique amongst all workflows describe in the Arazzo Description. The workflowId value is case-sensitive. Tools and libraries MAY use the workflowId to uniquely identify a workflow, therefore, it is RECOMMENDED to follow common programming naming conventions. SHOULD conform to the regular expression [A-Za-z0-9_-]+.
     */
    workflowId: WorkflowId;
    /**
     * A summary of the purpose or objective of the workflow.
     */
    summary?: string;
    /**
     * A description of the workflow. CommonMark syntax MAY be used for rich text representation.
     */
    description?: Markdown;
    /**
     * A JSON Schema 2020-12 object representing the input parameters used by this workflow.
     */
    inputs?: JsonSchema;
    /**
     * A list of workflows that MUST be completed before this workflow can be processed. The values provided MUST be a workflowId. If the workflow depended on is defined within the current Workflow Document, then specify the workflowId of the relevant local workflow. If the workflow is defined in a separate Arazzo Document then the workflow MUST be defined in the sourceDescriptions and the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes.
     */
    dependsOn?: WorkflowReference[];
    /**
     * REQUIRED. An ordered list of steps where each step represents a call to an API operation or to another workflow.
     */
    steps: Step[];
    /**
     * A list of success actions that are applicable for all steps described under this workflow. These success actions can be overridden at the step level but cannot be removed there. If a Reusable Object is provided, it MUST link to success actions defined in the components/successActions of the current Arazzo document. The list MUST NOT include duplicate success actions.
     */
    successActions?: (SuccessAction | ReusableObject)[];
    /**
     * A list of failure actions that are applicable for all steps described under this workflow. These failure actions can be overridden at the step level but cannot be removed there. If a Reusable Object is provided, it MUST link to failure actions defined in the components/failureActions of the current Arazzo document. The list MUST NOT include duplicate failure actions.
     */
    failureActions?: (FailureAction | ReusableObject)[];
    /**
     * A map between a friendly name and a dynamic output value. The name MUST use keys that match the regular expression: ^[a-zA-Z0-9.-_]+$.
     */
    outputs?: { [key: LookupKey]: WorkflowExpression };
    /**
     * A list of parameters that are applicable for all steps described under this workflow. These parameters can be overridden at the step level but cannot be removed there. Each parameter MUST be passed to an operation or workflow as referenced by operationId, operationPath, or workflowId as specified within each step. If a Reusable Object is provided, it MUST link to a parameter defined in the components/parameters of the current Arazzo document. The list MUST NOT include duplicate parameters.
     */
    parameters?: (Parameter | ReusableObject)[];
};
