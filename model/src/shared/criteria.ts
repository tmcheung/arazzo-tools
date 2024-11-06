import type {
    SimpleCondition,
    Regex,
    JsonPath,
    XPathExpression,
    RuntimeExpression,
} from "./common.ts";

abstract class AbstractCriterionExpressionType {
    constructor(
        /**
         * The type of condition to be applied. The options allowed are jsonpath or xpath.
         */
        public type: "jsonpath" | "xpath",
        /**
         * A short hand string representing the version of the expression type being used. The allowed values for JSONPath are draft-goessner-dispatch-jsonpath-00. The allowed values for XPath are xpath-30, xpath-20, or xpath-10.
         */
        public version:
            | "draft-goessner-dispatch-jsonpath-00"
            | "xpath-10"
            | "xpath-20"
            | "xpath-30"
    ) {}
}

/**
 * An object used to describe the type and version of an expression used within a Criterion Object. If this object is not defined, then the following default applies:
 * JSONPath as described by RFC9535
 * Defining this object gives the ability to utilize tooling compatible with older versions of either JSONPath.
 */
export class JsonPathCriterionExpressionType extends AbstractCriterionExpressionType {
    type: "jsonpath" = "jsonpath";
    version: "draft-goessner-dispatch-jsonpath-00" =
        "draft-goessner-dispatch-jsonpath-00";
    constructor() {
        super("jsonpath", "draft-goessner-dispatch-jsonpath-00");
    }
}

/**
 * An object used to describe the type and version of an expression used within a Criterion Object. If this object is not defined, then the following default applies:
 * XPath as described by XML Path Language 3.1
 * Defining this object gives the ability to utilize tooling compatible with older versions of XPath.
 */
export class XPathCriterionExpressionType extends AbstractCriterionExpressionType {
    type: "xpath" = "xpath";

    constructor(public version: "xpath-10" | "xpath-20" | "xpath-30") {
        super("xpath", version);
    }
}

export type CriterionExpressionType =
    | JsonPathCriterionExpressionType
    | XPathCriterionExpressionType;

export class BaseCriterion {
    /**
     * The condition to apply (e.g. $statusCode == 200 which applies an operator on a value obtained from a runtime expression)
     */
    condition: SimpleCondition;
    /**
     * The type of condition to be applied.
     */
    type: "simple" = "simple";

    constructor(condition: string) {
        this.condition = condition as SimpleCondition;
    }
}

export class SimpleCriterion extends BaseCriterion {
    /**
     * A runtime expression used to set the context for the condition to be applied on.
     */
    context: RuntimeExpression;

    constructor(context: RuntimeExpression, condition: string) {
        super(condition as SimpleCondition);
        this.context = context;
    }
}

export class ComplexCriterion {
    /**
     * A runtime expression used to set the context for the condition to be applied on.
     */
    context: RuntimeExpression;

    /**
     * The type of condition to be applied.
     */
    type: "regex" | "jsonpath" | "xpath" | CriterionExpressionType;

    /**
     * The condition to apply. Conditions can be a regex, a XPathExpression or a JSONPath expression.
     */
    condition: Regex | JsonPath | XPathExpression;

    constructor(
        context: RuntimeExpression,
        condition: string,
        type: "regex" | "jsonpath" | "xpath" | CriterionExpressionType
    ) {
        this.context = context;
        this.type = type;
        if (typeof type === "string") {
            switch (type) {
                case "regex":
                    this.condition = condition as Regex;
                    break;
                case "jsonpath":
                    this.condition = condition as JsonPath;
                    break;
                case "xpath":
                    this.condition = condition as XPathExpression;
                    break;
            }
        } else {
            if (type instanceof JsonPathCriterionExpressionType) {
                this.condition = condition as JsonPath;
            } else if (type instanceof XPathCriterionExpressionType) {
                this.condition = condition as XPathExpression;
            } else {
                throw "Invalid Criterion Expression Type";
            }
        }
    }
}

/**
 * An object used to specify the context, conditions, and condition types that can be used to prove or satisfy assertions specified in Step Object successCriteria, Success Action Object criteria, and Failure Action Object criteria.
 */
export type Criterion = BaseCriterion | SimpleCriterion | ComplexCriterion;
