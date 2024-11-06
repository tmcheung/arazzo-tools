# Arazzo description parser
This library includes a parser for the Arazzo model in this repository. It is heavily dependent on the library [zod](https://github.com/colinhacks/zod/).

## Scope
The parser should take a valid Arazzo description and output an object which follows the Arazzo model.
Given that the description is of an invalid format, a descriptive error message should be provided.

The parsed description is only validated structurally; Runtime expressions, references, etc. are not validated to be correct/valid.