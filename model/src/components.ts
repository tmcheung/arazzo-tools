import type { JsonSchema, LookupKey } from "./shared/common.ts";
import type { FailureAction } from "./shared/failureActions.ts";
import type { Parameter } from "./shared/parameter.ts";
import type { SuccessAction } from "./shared/successActions.ts";

/**
 * Holds a set of reusable objects for different aspects of the Arazzo Specification.
 * All objects defined within the components object will have no effect on the Arazzo Description unless they are explicitly referenced from properties outside the components object.
 * Components are scoped to the Arazzo document they are defined in.
 * For example, if a step defined in Arazzo document "A" references a workflow defined in Arazzo document "B", the components in "A" are not considered when evaluating the workflow referenced in "B".
 */
export type Components = {
    /**
     * An object to hold reusable JSON Schema objects to be referenced from workflow inputs.
     */
    inputs?: { [key: LookupKey]: JsonSchema };
    /**
     * An object to hold reusable Parameter Objects
     */
    parameters?: { [key: LookupKey]: Parameter };
    /**
     * An object to hold reusable Success Actions Objects.
     */
    successActions?: { [key: LookupKey]: SuccessAction };
    /**
     * An object to hold reusable Failure Actions Objects.
     */
    failureActions?: { [key: LookupKey]: FailureAction };
};
