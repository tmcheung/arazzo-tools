import type { WorkflowReference, StepId } from "./common.ts";
import type { Criterion } from "./criteria.ts";

abstract class AbstractSuccessAction {
    constructor(
        /**
         * The type of action to take.
         */
        public type: "end" | "goto",
        /**
         * The name of the success action. Names are case sensitive.
         */
        public name: string,
        /**
         * A list of assertions to determine if this action SHALL be executed. Each assertion is described using a Criterion Object. All criteria assertions MUST be satisfied for the action to be executed.
         */
        public criteria?: Criterion[]
    ) {}
}

export class EndSuccessAction extends AbstractSuccessAction {
    type: "end" = "end";

    constructor(name: string, criteria?: Criterion[]) {
        super("end", name, criteria);
    }
}

export class GotoStepSuccessAction extends AbstractSuccessAction {
    type: "goto" = "goto";
    constructor(
        name: string,
        /**
         * The stepId to transfer to upon success of the step. This field is only relevant when the type field value is "goto". The referenced stepId MUST be within the current workflow. This field is mutually exclusive to workflowId.
         */
        public stepId: StepId,
        criteria?: Criterion[]
    ) {
        super("goto", name, criteria);
    }
}

export class GotoWorkflowSuccessAction extends AbstractSuccessAction {
    type: "goto" = "goto";
    constructor(
        name: string,
        /**
         * The workflowId referencing an existing workflow within the Arazzo Description to transfer to upon success of the step. This field is only relevant when the type field value is "goto". If multiple arazzo type sourceDescriptions are defined, then the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. This field is mutually exclusive to stepId.
         */
        public workflowId: WorkflowReference,
        criteria?: Criterion[]
    ) {
        super("goto", name, criteria);
    }
}

/**
 * A single success action which describes an action to take upon success of a workflow step. There are two possible values for the type field:
 * end - The workflow ends, and context returns to the caller with applicable outputs
 * goto - A one-way transfer of workflow control to the specified label (either a workflowId or stepId)
 */
export type SuccessAction =
    | EndSuccessAction
    | GotoStepSuccessAction
    | GotoWorkflowSuccessAction;
