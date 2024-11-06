# Arazzo description model
This library includes a model for Arazzo descriptions that can be used as a target for parsing, and the base of more complex tooling for the Arazzo specification.

## Scope, correctness and validation of descriptions
The model aims to provide a typesafe user experience, however, it is important to understand some aspects of the scope of the project.
1. Typesafe does not necessarily mean that the object in the shape of a Arazzo description was actually parsed from a document with a valid format, that is entirely dependent on the parser. 
2. The Arazzo specification includes Runtime expressions, references to OpenAPI description operations, files and more. Again, the model does not provide any guarantees that these are valid expressions, references, etc. It only guarantees that something is of the shape of an Arazzo description.


## Differences from the Arazzo specification schema
The model is slightly different from the [Arazzo specification schema](https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.0.md#schema) as it tries to contain some of the objects' logic and express them using typings rather than exposing the logic to the user.

### To demonstrate this let's have a look at the [Criterion Expression Type Object](https://github.com/OAI/Arazzo-Specification/blob/main/versions/1.0.0.md#criterion-expression-type-object)
The Criterion Expression Type Object has two fields:
- `type` is used to decide which type of condition to apply and has two allowed values `"jsonpath"` and `"xpath"`.
- `version` is used to decide the version of the condition type and has different sets of allowed values depending on the applied condition type. If the condition type is `"jsonpath"` we have `"draft-goessner-dispatch-jsonpath-00"` and for the type `"xpath"` we have `"xpath-30"`, `"xpath-20"`, and `"xpath-10"`.

The most simple typescript model for this object could be expressed like this:
``` javascript
type CriterionExpressionType = {
    type: "jsonpath" | "xpath",
    version: "draft-goessner-dispatch-jsonpath-00" | "xpath-10" | "xpath-20" | "xpath-30",
}
```

Instead of the above where the type allows invalid combinations of the type and version values (e.g. `type = "jsonpath"` and `version = "xpath-10"`) we try to contain this logic with a union type:

``` javascript
type CriterionExpressionType = {
    type: "jsonpath",
    version: "draft-goessner-dispatch-jsonpath-00",
} & {
    type: "xpath",
    version: "xpath-10" | "xpath-20" | "xpath-30",
}
```

Furthermore, to simplify and streamline the identification of a specific type in a union, we use the `instanceof` operator by leveraging classes.

``` javascript
class JsonPathCriterionExpressionType {
    type: "jsonpath" = "jsonpath";
    version: "draft-goessner-dispatch-jsonpath-00" =
        "draft-goessner-dispatch-jsonpath-00";
}

class XPathCriterionExpressionType {
    type: "xpath" = "xpath";

    constructor(public version: "xpath-10" | "xpath-20" | "xpath-30") {}
}

export type CriterionExpressionType = JsonPathCriterionExpressionType | XPathCriterionExpressionType
```

``` javascript
function(type: CriterionExpressionType) {
    if(type instanceof JsonPathCriterionExpressionType) {
        // type.version is definitely "draft-goessner-dispatch-jsonpath-00" here
    }
}
```