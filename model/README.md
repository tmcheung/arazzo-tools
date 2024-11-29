# Arazzo description model
This library includes a model for Arazzo descriptions that can be used as a target for parsing, and the base of more complex tooling for the Arazzo specification.

## Scope, correctness and validation of descriptions
The model aims to provide a typesafe user experience, however, it is important to understand some aspects of the scope of the project.
1. Typesafe does not necessarily mean that the object in the shape of a Arazzo description was actually parsed from a document with a valid format, that is entirely dependent on the parser. 
2. The Arazzo specification includes Runtime expressions, references to OpenAPI description operations, files and more. Again, the model does not provide any guarantees that these are valid expressions, references, etc. It only guarantees that something is of the shape of an Arazzo description.


## Differences from the Arazzo specification schema
The model is slightly different from the [Arazzo specification schema](https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.0.md#schema) as it tries to contain some of the objects' logic and express them using typings rather than exposing the logic to the user.

### To demonstrate this let's have a look at the [Success Action Object](https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.0.md#success-action-object)
The Success Action Object has five fields, two which are mutually exclusive and strongly coupled to a third field `type`:
- `type` is the type of action to take. Possible values are "end" or "goto"
- `workflowId` is a reference to a workflow to transfer to upon success. This field is both mutually exclusive to `stepId` and only relevant when type is "goto"
- `stepId` is a reference to a step to transfer to upon success. This field is both mutually exclusive to `workflowId` and only relevant when type is "goto"


The most simple typescript model for this object could be expressed like the schema is defined, with optional fields like this:
``` javascript
type SuccessAction = {
    type: "end" | "goto",
    workflowId?: WorkflowReference,
    stepId?: StepId,
    ...
}
```

Instead of the above where the type allows invalid combinations of `type`, `workflowId` and `stepId` (e.g. `{ type = "end", workflowId: "w1", stepId: "s1" }`) we try to contain this logic with a union type:

``` javascript
type SuccessAction = {
    type: "end",
    ...
} & {
    type: "goto",
    workflowId: WorkflowReference,
    ...
} & {
    type: "goto",
    stepId: StepId,
}
```

Furthermore, to simplify and streamline the identification of a specific type in a union we use classes. The `instanceof` operator can be used as type guard to narrow the union types.

``` javascript
class EndSuccessAction {
    type = "end";
    constructor(...){}
}

class GotoWorkflowSuccessAction {
    type = "goto";
    constructor(public workflowId: WorkflowReference, ...){}
}

class GotoStepSuccessAction {
    type = "goto";
    constructor(public stepId: StepId, ...){}
}

// SuccessAction is either a EndSuccessAction, GotoWorkflowSuccessAction or GotoStepSuccessAction
export type SuccessAction = EndSuccessAction | GotoWorkflowSuccessAction | GotoStepSuccessAction
```

``` javascript
function(action: SuccessAction) {
    // instanceof can be used to narrow the union type
    if(action instanceof GotoWorkflowSuccessAction) {
        // action.stepId definitely exists here 
    }
}
```

### List of union types
#### Source Description union types
- `SourceDescriptionURL = URL | RelativeUrl`

#### Workflow union types
- `WorkflowReference = WorkflowReferenceId | WorkflowReferenceExpression`
- `WorkflowSuccessAction = SuccessAction | ReusableObject`
- `WorkflowFailureAction = FailureAction | ReusableObject`
- `WorkflowParameter = Parameter | ReusableObject`

#### Step union types
- `Step = StaticStep | OperationIdStep | OperationPathStep | WorkflowStep`
- `OperationReference = OperationReferenceId | OperationReferenceExpression`
- `StepSuccessAction = SuccessAction | ReusableObject`
- `StepFailureAction = FailureAction | ReusableObject`
- `StepParameter = Parameter | ReusableObject`
- `PayloadReplacement = JsonPointerLiteralPayloadReplacement | JsonPointerExpressionPayloadReplacement | XPathLiteralPayloadReplacement | XPathExpressionPayloadReplacement`

#### Criterion union types
- `Criterion = SimpleCriterion | RegexCriterion | JsonPathCriterion | XPathCriterion`

#### Other union types
- `SuccessAction = EndSuccessAction | GotoStepSuccessAction | GotoWorkflowSuccessAction`
- `FailureAction = EndFailureAction | GotoStepFailureAction | GotoWorkflowFailureAction | RetryStepFailureAction | RetryWorkflowFailureAction`
- `Parameter = ExpressionParameter | AnyParameter`