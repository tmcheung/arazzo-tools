// import z from "z";
// import {
//     FailureAction,
//     JsonSchema,
//     LookupKey,
//     Parameter,
//     SuccessAction,
// } from "./common.ts";

// /**
//  * Holds a set of reusable objects for different aspects of the Arazzo Specification.
//  * All objects defined within the components object will have no effect on the Arazzo Description unless they are explicitly referenced from properties outside the components object.
//  * Components are scoped to the Arazzo document they are defined in.
//  * For example, if a step defined in Arazzo document "A" references a workflow defined in Arazzo document "B", the components in "A" are not considered when evaluating the workflow referenced in "B".
//  */
// export const Components = z
//     .object({
//         inputs: z
//             .record(LookupKey, JsonSchema)
//             .optional()
//             .describe(
//                 "An object to hold reusable JSON Schema objects to be referenced from workflow inputs."
//             ),
//         parameters: z
//             .record(LookupKey, Parameter)
//             .optional()
//             .describe("An object to hold reusable Parameter Objects"),
//         successActions: z
//             .record(LookupKey, SuccessAction)
//             .optional()
//             .describe("An object to hold reusable Success Actions Objects."),
//         failureActions: z
//             .record(LookupKey, FailureAction)
//             .optional()
//             .describe("An object to hold reusable Failure Actions Objects."),
//     })
//     .strict();
// export type Components = z.infer<typeof Components>;

export type Components = {};
