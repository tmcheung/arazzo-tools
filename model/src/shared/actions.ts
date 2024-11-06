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

export class GotoSuccessAction extends AbstractSuccessAction {
    type: "goto" = "goto";
    constructor(
        name: string,
        criteria?: Criterion[],
        /**
         * The workflowId referencing an existing workflow within the Arazzo Description to transfer to upon success of the step. This field is only relevant when the type field value is "goto". If multiple arazzo type sourceDescriptions are defined, then the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. This field is mutually exclusive to stepId.
         */
        public workflowId?: WorkflowReference,
        /**
         * The stepId to transfer to upon success of the step. This field is only relevant when the type field value is "goto". The referenced stepId MUST be within the current workflow. This field is mutually exclusive to workflowId.
         */
        public stepId?: StepId
    ) {
        super("goto", name, criteria);
    }
}

/**
 * A single success action which describes an action to take upon success of a workflow step. There are two possible values for the type field:
 * end - The workflow ends, and context returns to the caller with applicable outputs
 * goto - A one-way transfer of workflow control to the specified label (either a workflowId or stepId)
 */
export type SuccessAction = EndSuccessAction | GotoSuccessAction;

// /**
//  * A single failure action which describes an action to take upon failure of a workflow step. There are three possible values for the type field:
//  * end - The workflow ends, and context returns to the caller with applicable outputs
//  * retry - The current step will be retried. The retry will be constrained by the retryAfter and retryLimit fields. If a stepId or workflowId are specified, then the reference is executed and the context is returned, after which the current step is retried.
//  * goto - A one-way transfer of workflow control to the specified label (either a workflowId or stepId)
//  */
// export const FailureAction = z
//     .object({
//         name: z.string(),
//         type: z.union([
//             z.literal("end"),
//             z.literal("retry"),
//             z.literal("goto"),
//         ]),
//         workflowId: WorkflowReference.optional(),
//         stepId: StepId.optional(),
//         retryAfter: z.number().gte(0).optional(),
//         retryLimit: z.number().int(),
//         criteria: Criterion.array().optional(),
//     })
//     .strict();
