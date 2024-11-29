import type {
    JsonPointer,
    BrandedString,
    RuntimeExpression,
    XPathExpression,
    Literal,
    WorkflowReference,
    BrandedAny,
    Markdown,
    StepId,
    ReusableObject,
    LookupKey,
} from "./shared/common.ts";
import type { Criterion } from "./shared/criteria.ts";
import type { FailureAction } from "./shared/failureActions.ts";
import type { Parameter } from "./shared/parameter.ts";
import type { SuccessAction } from "./shared/successActions.ts";

/**
 * The name of an existing, resolvable operation, as defined with a unique operationId and existing within the single sourceDescription available
 */
type OperationId = BrandedString<"OperationId">;

export class OperationReferenceId {
    constructor(public value: OperationId) {}
}

export class OperationReferenceExpression {
    constructor(public value: RuntimeExpression) {}
}

/**
 * The name of an existing, resolvable operation, as defined with a unique operationId and existing within one of the sourceDescriptions.
 * The referenced operation will be invoked by this workflow step. If multiple (non arazzo type) sourceDescriptions are defined,
 * then the operationId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<operationId>) to avoid ambiguity or potential clashes.
 */
export type OperationReference =
    | OperationReferenceId
    | OperationReferenceExpression;

/**
 * A reference to a Source combined with a JSON Pointer to reference an operation. This field is mutually exclusive of the operationId and workflowId fields respectively.
 * The operation being referenced MUST be described within one of the sourceDescriptions descriptions.
 * A runtime expression syntax MUST be used to identify the source description document.
 */
export type OperationPath = {
    source: RuntimeExpression;
    path: JsonPointer;
};

abstract class AbstractPayloadReplacement {
    constructor(
        /**
         * A JSON Pointer or XPath Expression which MUST be resolved against the request body. Used to identify the location to inject the value.
         */
        public target: JsonPointer | XPathExpression,
        /**
         * The value set within the target location. The value can be a constant or a Runtime Expression to be evaluated and passed to the referenced operation or workflow.
         */
        public value: Literal | RuntimeExpression
    ) {}
}

export class JsonPointerLiteralPayloadReplacement extends AbstractPayloadReplacement {
    constructor(public target: JsonPointer, public value: Literal) {
        super(target, value);
    }
}

export class JsonPointerExpressionPayloadReplacement extends AbstractPayloadReplacement {
    constructor(public target: JsonPointer, public value: RuntimeExpression) {
        super(target, value);
    }
}
export class XPathLiteralPayloadReplacement extends AbstractPayloadReplacement {
    constructor(public target: XPathExpression, public value: Literal) {
        super(target, value);
    }
}
export class XPathExpressionPayloadReplacement extends AbstractPayloadReplacement {
    constructor(
        public target: XPathExpression,
        public value: RuntimeExpression
    ) {
        super(target, value);
    }
}

/**
 * Describes a location within a payload (e.g., a request body) and a value to set within the location.
 */
export type PayloadReplacement =
    | JsonPointerLiteralPayloadReplacement
    | JsonPointerExpressionPayloadReplacement
    | XPathLiteralPayloadReplacement
    | XPathExpressionPayloadReplacement;

/**
 * A single request body describing the Content-Type and request body content to be passed by a step to an operation.
 */
export type RequestBody = {
    /**
     * The Content-Type for the request content. If omitted then refer to Content-Type specified at the targeted operation to understand serialization requirements.
     */
    contentType?: string;
    /**
     * A value representing the request body payload. The value can be a literal value or can contain Runtime Expressions which MUST be evaluated prior to calling the referenced operation. To represent examples of media types that cannot be naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.
     */
    payload: BrandedAny<"Payload">;
    /**
     * A list of locations and values to set within a payload.
     */
    replacements?: PayloadReplacement;
};

/**
 * A runtime expression within the context of its step
 */
export type StepExpression = RuntimeExpression;

export type StepSuccessAction = SuccessAction | ReusableObject;
export type StepFailureAction = FailureAction | ReusableObject;
export type StepParameter = Parameter | ReusableObject;

abstract class AbstractStep {
    constructor(
        /**
         * Unique string to represent the step. The stepId MUST be unique amongst all steps described in the workflow. The stepId value is case-sensitive. Tools and libraries MAY use the stepId to uniquely identify a workflow step, therefore, it is RECOMMENDED to follow common programming naming conventions. SHOULD conform to the regular expression [A-Za-z0-9_\-]+.
         */
        public stepId: StepId,
        /**
         * A description of the step. CommonMark syntax MAY be used for rich text representation.
         */
        public description?: Markdown,
        /**
         * A list of assertions to determine the success of the step. Each assertion is described using a Criterion Object. All assertions MUST be satisfied for the step to be deemed successful.
         */
        public successCriteria?: Criterion[],
        /**
         * An array of success action objects that specify what to do upon step success. If omitted, the next sequential step shall be executed as the default behavior. If multiple success actions have similar criteria, the first sequential action matching the criteria SHALL be the action executed. If a success action is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a success action defined in the components of the current Arazzo document. The list MUST NOT include duplicate success actions.
         */
        public onSuccess?: StepSuccessAction[],
        /**
         * An array of failure action objects that specify what to do upon step failure. If omitted, the default behavior is to break and return. If multiple failure actions have similar criteria, the first sequential action matching the criteria SHALL be the action executed. If a failure action is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a failure action defined in the components of the current Arazzo document. The list MUST NOT include duplicate failure actions.
         */
        public onFailure?: StepFailureAction[],
        /**
         * A map between a friendly name and a dynamic output value defined using a runtime expression. The name MUST use keys that match the regular expression: ^[a-zA-Z0-9\.\-_]+$.
         */
        public outputs?: { [key: LookupKey]: StepExpression }
    ) {}
}

abstract class AbstractInvocationStep extends AbstractStep {
    constructor(
        stepId: StepId,
        description?: Markdown,
        /**
         * A list of parameters that MUST be passed to an operation or workflow as referenced by operationId, operationPath, or workflowId. If a parameter is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a parameter defined in the components/parameters of the current Arazzo document. The list MUST NOT include duplicate parameters.
         */
        public parameter?: StepParameter,
        /**
         * The request body to pass to an operation as referenced by operationId or operationPath. The requestBody is fully supported in HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as GET, HEAD and DELETE), requestBody is permitted but does not have well-defined semantics and SHOULD be avoided if possible.
         */
        public requestBody?: RequestBody,
        successCriteria?: Criterion[],
        onSuccess?: StepSuccessAction[],
        onFailure?: StepFailureAction[],
        outputs?: { [key: LookupKey]: StepExpression }
    ) {
        super(
            stepId,
            description,
            successCriteria,
            onSuccess,
            onFailure,
            outputs
        );
    }
}

export class StaticStep extends AbstractStep {
    constructor(
        /**
         * Unique string to represent the step. The stepId MUST be unique amongst all steps described in the workflow. The stepId value is case-sensitive. Tools and libraries MAY use the stepId to uniquely identify a workflow step, therefore, it is RECOMMENDED to follow common programming naming conventions. SHOULD conform to the regular expression [A-Za-z0-9_\-]+.
         */
        stepId: StepId,
        /**
         * A description of the step. CommonMark syntax MAY be used for rich text representation.
         */
        description?: Markdown,
        /**
         * A list of assertions to determine the success of the step. Each assertion is described using a Criterion Object. All assertions MUST be satisfied for the step to be deemed successful.
         */
        successCriteria?: Criterion[],
        /**
         * An array of success action objects that specify what to do upon step success. If omitted, the next sequential step shall be executed as the default behavior. If multiple success actions have similar criteria, the first sequential action matching the criteria SHALL be the action executed. If a success action is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a success action defined in the components of the current Arazzo document. The list MUST NOT include duplicate success actions.
         */
        onSuccess?: StepSuccessAction[],
        /**
         * An array of failure action objects that specify what to do upon step failure. If omitted, the default behavior is to break and return. If multiple failure actions have similar criteria, the first sequential action matching the criteria SHALL be the action executed. If a failure action is already defined at the Workflow, the new definition will override it but can never remove it. If a Reusable Object is provided, it MUST link to a failure action defined in the components of the current Arazzo document. The list MUST NOT include duplicate failure actions.
         */
        onFailure?: StepFailureAction[],
        /**
         * A map between a friendly name and a dynamic output value defined using a runtime expression. The name MUST use keys that match the regular expression: ^[a-zA-Z0-9\.\-_]+$.
         */
        outputs?: { [key: LookupKey]: StepExpression }
    ) {
        super(
            stepId,
            description,
            successCriteria,
            onSuccess,
            onFailure,
            outputs
        );
    }
}

export class OperationIdStep extends AbstractInvocationStep {
    constructor(
        stepId: StepId,
        /**
         * The name of an existing, resolvable operation, as defined with a unique operationId and existing within one of the sourceDescriptions. The referenced operation will be invoked by this workflow step. If multiple (non arazzo type) sourceDescriptions are defined, then the operationId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<operationId>) to avoid ambiguity or potential clashes. This field is mutually exclusive of the operationPath and workflowId fields respectively.
         */
        public operationId: OperationReference,
        description?: Markdown,
        parameter?: StepParameter,
        requestBody?: RequestBody,
        successCriteria?: Criterion[],
        onSuccess?: StepSuccessAction[],
        onFailure?: StepFailureAction[],
        outputs?: { [key: LookupKey]: StepExpression }
    ) {
        super(
            stepId,
            description,
            parameter,
            requestBody,
            successCriteria,
            onSuccess,
            onFailure,
            outputs
        );
    }
}

export class OperationPathStep extends AbstractInvocationStep {
    constructor(
        stepId: StepId,
        /**
         * A reference to a Source combined with a JSON Pointer to reference an operation. This field is mutually exclusive of the operationId and workflowId fields respectively. The operation being referenced MUST be described within one of the sourceDescriptions descriptions. A runtime expression syntax MUST be used to identify the source description document. If the referenced operation has an operationId defined then the operationId SHOULD be preferred over the operationPath.
         */
        public operationPath: OperationPath,
        description?: Markdown,
        parameter?: StepParameter,
        requestBody?: RequestBody,
        successCriteria?: Criterion[],
        onSuccess?: StepSuccessAction[],
        onFailure?: StepFailureAction[],
        outputs?: { [key: LookupKey]: StepExpression }
    ) {
        super(
            stepId,
            description,
            parameter,
            requestBody,
            successCriteria,
            onSuccess,
            onFailure,
            outputs
        );
    }
}

export class WorkflowStep extends AbstractInvocationStep {
    constructor(
        stepId: StepId,
        /**
         * The workflowId referencing an existing workflow within the Arazzo Description. If multiple arazzo type sourceDescriptions are defined, then the workflowId MUST be specified using a runtime expression (e.g., $sourceDescriptions.<name>.<workflowId>) to avoid ambiguity or potential clashes. The field is mutually exclusive of the operationId and operationPath fields respectively.
         */
        public workflowId: WorkflowReference,
        description?: Markdown,
        parameter?: StepParameter,
        requestBody?: RequestBody,
        successCriteria?: Criterion[],
        onSuccess?: StepSuccessAction[],
        onFailure?: StepFailureAction[],
        outputs?: { [key: LookupKey]: StepExpression }
    ) {
        super(
            stepId,
            description,
            parameter,
            requestBody,
            successCriteria,
            onSuccess,
            onFailure,
            outputs
        );
    }
}

/**
 * Describes a single workflow step which MAY be a call to an API operation (OpenAPI Operation Object or another Workflow Object).
 * A step is an instance of one of the following classes: StaticStep, OperationIdStep, OperationPathStep, WorkflowStep
 */
export type Step =
    | StaticStep
    | OperationIdStep
    | OperationPathStep
    | WorkflowStep;
