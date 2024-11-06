declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;
export type BrandedString<B> = Branded<string, B>;

/**
 * Lookup key for Maps. The keys must match the regex "^[a-zA-Z0-9\.\-_]+$"
 */
export type LookupKey = BrandedString<"LookupKey">;

/**
 * CommonMark syntax MAY be used for rich text representation.
 */
export type Markdown = BrandedString<"Markdown">;

/**
 * MUST be in the form of a URI-reference as defined by RFC3986
 */
export type RelativeUrl = BrandedString<"RelativeUrl">;

export type Url = URL;

export type Literal = string | number | boolean | null;
export type Json = Literal | { [key: string]: Json } | Json[];

export type JsonPointer = BrandedString<"JsonPointer">;
export type JsonPath = BrandedString<"JsonPath">;
export type XPathExpression = BrandedString<"XPathExpression">;
export type Regex = BrandedString<"Regex">;
export type SimpleCondition = BrandedString<"SimpleCondition">;

/**
 * A runtime expression allows values to be defined based on information that will be available within an HTTP message,
 * an event message, and within objects serialized from the Arazzo document such as workflows or steps.
 */
export type RuntimeExpression = BrandedString<"RuntimeExpression">;

/**
 * Unique string to represent the workflow. The id MUST be unique amongst all workflows describe in the Arazzo Description. The workflowId value is case-sensitive.
 * Tools and libraries MAY use the workflowId to uniquely identify a workflow, therefore, it is RECOMMENDED to follow common programming naming conventions.
 * SHOULD conform to the regular expression [A-Za-z0-9_\-]+.
 */
export type WorkflowId = BrandedString<"WorkflowId">;

export class WorkflowReferenceId {
    constructor(public value: WorkflowId) {}
}

export class WorkflowReferenceExpression {
    constructor(public value: RuntimeExpression) {}
}

/**
 * The values provided MUST be a workflowId. If the workflow depended on is defined within the current Workflow Document,
 * then specify the workflowId of the relevant local workflow.
 *
 * If the workflow is defined in a separate Arazzo Document then the workflow MUST be defined in the sourceDescriptions
 * and the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes.
 */
export type WorkflowReference =
    | WorkflowReferenceId
    | WorkflowReferenceExpression;

/**
 * Unique string to represent the step. The stepId MUST be unique amongst all steps described in the workflow. The stepId value is case-sensitive.
 * Tools and libraries MAY use the stepId to uniquely identify a workflow step, therefore, it is RECOMMENDED to follow common programming naming conventions.
 * SHOULD conform to the regular expression [A-Za-z0-9_\-]+.
 */
export type StepId = BrandedString<"StepId">;

/**
 * A simple object to allow referencing of objects contained within the Components Object.
 * It can be used from locations within steps or workflows in the Arazzo Description.
 * Note - Input Objects MUST use standard JSON Schema referencing via the $ref keyword while all non JSON Schema objects use this object and its expression based referencing mechanism.
 */
export class ReusableObject {
    // deno-lint-ignore no-explicit-any
    constructor(public reference: RuntimeExpression, public value?: any) {}
}
