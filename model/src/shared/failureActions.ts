import type { WorkflowReference, StepId } from "./common.ts";
import type { Criterion } from "./criteria.ts";

abstract class AbstractFailureAction {
    constructor(
        /**
         * The type of action to take.
         */
        public type: "end" | "goto" | "retry",
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

export class EndFailureAction extends AbstractFailureAction {
    type: "end" = "end";

    constructor(name: string, criteria?: Criterion[]) {
        super("end", name, criteria);
    }
}
export class GotoStepFailureAction extends AbstractFailureAction {
    type: "goto" = "goto";
    constructor(
        name: string,
        /**
         * The stepId to transfer to upon failure of the step. This field is only relevant when the type field value is "goto" or "retry". The referenced stepId MUST be within the current workflow. This field is mutually exclusive to workflowId. When used with "retry", context transfers back upon completion of the specified step.
         */
        public stepId: StepId,
        criteria?: Criterion[]
    ) {
        super("goto", name, criteria);
    }
}
export class GotoWorkflowFailureAction extends AbstractFailureAction {
    type: "goto" = "goto";
    constructor(
        name: string,
        /**
         * The workflowId referencing an existing workflow within the Arazzo Description to transfer to upon failure of the step. This field is only relevant when the type field value is "goto" or "retry". If multiple arazzo type sourceDescriptions are defined, then the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. This field is mutually exclusive to stepId. When used with "retry", context transfers back upon completion of the specified workflow.
         */
        public workflowId: WorkflowReference,
        criteria?: Criterion[]
    ) {
        super("goto", name, criteria);
    }
}

abstract class RetryFailureAction extends AbstractFailureAction {
    type: "retry" = "retry";
    constructor(
        name: string,
        /**
         * A non-negative decimal indicating the seconds to delay after the step failure before another attempt SHALL be made. Note: if an HTTP Retry-After response header was returned to a step from a targeted operation, then it SHOULD overrule this particular field value. This field only applies when the type field value is "retry"
         */
        public retryAfter: number,
        /**
         * A non-negative integer indicating how many attempts to retry the step MAY be attempted before failing the overall step. If not specified then a single retry SHALL be attempted. This field only applies when the type field value is "retry". The retryLimit MUST be exhausted prior to executing subsequent failure actions.
         */
        public retryLimit: number,
        criteria?: Criterion[]
    ) {
        if (retryAfter < 0) throw "retryAfter must be greater than or equal 0";
        if (retryLimit < 0 && Number.isInteger(retryLimit))
            throw "retryLimit must be a positive integer";
        super("retry", name, criteria);
    }
}
export class RetryStepFailureAction extends RetryFailureAction {
    constructor(
        name: string,
        /**
         * The stepId to transfer to upon failure of the step. This field is only relevant when the type field value is "goto" or "retry". The referenced stepId MUST be within the current workflow. This field is mutually exclusive to workflowId. When used with "retry", context transfers back upon completion of the specified step.
         */
        public stepId: StepId,
        retryAfter: number,
        retryLimit: number,
        criteria?: Criterion[]
    ) {
        super(name, retryAfter, retryLimit, criteria);
    }
}
export class RetryWorkflowFailureAction extends RetryFailureAction {
    constructor(
        name: string,
        /**
         * The workflowId referencing an existing workflow within the Arazzo Description to transfer to upon failure of the step. This field is only relevant when the type field value is "goto" or "retry". If multiple arazzo type sourceDescriptions are defined, then the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. This field is mutually exclusive to stepId. When used with "retry", context transfers back upon completion of the specified workflow.
         */
        public workflowId: WorkflowReference,
        retryAfter: number,
        retryLimit: number,
        criteria?: Criterion[]
    ) {
        super(name, retryAfter, retryLimit, criteria);
    }
}

/**
 * A single failure action which describes an action to take upon failure of a workflow step. There are three possible values for the type field:
 * end - The workflow ends, and context returns to the caller with applicable outputs
 * retry - The current step will be retried. The retry will be constrained by the retryAfter and retryLimit fields. If a stepId or workflowId are specified, then the reference is executed and the context is returned, after which the current step is retried.
 * goto - A one-way transfer of workflow control to the specified label (either a workflowId or stepId)
 */
export type FailureAction =
    | EndFailureAction
    | GotoStepFailureAction
    | GotoWorkflowFailureAction
    | RetryStepFailureAction
    | RetryWorkflowFailureAction;
