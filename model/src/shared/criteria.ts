import type {
    SimpleCondition,
    Regex,
    JsonPath,
    XPathExpression,
    RuntimeExpression,
} from "./common.ts";

abstract class AbstractCriterion {
    constructor(
        /**
         * The type of condition to be applied.
         */
        public type: "simple" | "regex" | "jsonpath" | "xpath",
        /**
         * The condition to apply (e.g. $statusCode == 200 which applies an operator on a value obtained from a runtime expression)
         */
        public condition: SimpleCondition | Regex | JsonPath | XPathExpression
    ) {}
}

export class SimpleCriterion extends AbstractCriterion {
    type: "simple" = "simple";

    constructor(
        /**
         * The condition to apply (e.g. $statusCode == 200 which applies an operator on a value obtained from a runtime expression)
         */
        public condition: SimpleCondition,
        /**
         * A runtime expression used to set the context for the condition to be applied on.
         */
        public context?: RuntimeExpression
    ) {
        super("simple", condition);
    }
}

export class RegexCriterion extends AbstractCriterion {
    type: "regex" = "regex";

    constructor(public condition: Regex, public context: RuntimeExpression) {
        super("regex", condition);
    }
}

export class JsonPathCriterion extends AbstractCriterion {
    type: "jsonpath" = "jsonpath";
    typeVersion: "default" | "draft-goessner-dispatch-jsonpath-00";

    constructor(
        public condition: JsonPath,
        public context: RuntimeExpression,
        typeVersion?: "default" | "draft-goessner-dispatch-jsonpath-00"
    ) {
        super("jsonpath", condition);
        this.typeVersion = typeVersion ?? "default";
    }
}

export class XPathCriterion extends AbstractCriterion {
    type: "xpath" = "xpath";
    typeVersion: "default" | "xpath-10" | "xpath-20" | "xpath-30";

    constructor(
        public condition: XPathExpression,
        public context: RuntimeExpression,
        typeVersion?: "default" | "xpath-10" | "xpath-20" | "xpath-30"
    ) {
        super("xpath", condition);
        this.typeVersion = typeVersion ?? "default";
    }
}

/**
 * An object used to specify the context, conditions, and condition types that can be used to prove or satisfy assertions specified in Step Object successCriteria, Success Action Object criteria, and Failure Action Object criteria.
 */
export type Criterion =
    | SimpleCriterion
    | RegexCriterion
    | JsonPathCriterion
    | XPathCriterion;
