import { parse as parseYaml } from "jsr:@std/yaml";
import { z } from "https://deno.land/x/zod/mod.ts";

const Markdown = z.string();

const RelativeUrl = z.string();

const Url = z
    .string()
    .url()
    .transform((url) => new URL(url));

const Info = z
    .object({
        title: z.string(),
        summary: z.string().optional(),
        description: Markdown.optional(),
        version: z.string(),
    })
    .passthrough();

const SourceDescription = z
    .object({
        name: z.string(), // should perhaps warn if not following regex: [A-Za-z0-9_\-]+
        url: z.union([Url, RelativeUrl]),
        type: z.union([z.literal("openapi"), z.literal("arazzo")]).optional(),
    })
    .passthrough();

type SourceDescription = z.infer<typeof SourceDescription>;

const Workflow = z.object({}).passthrough();

const Components = z.object({}).passthrough();

const ArazzoSpecification = z
    .object({
        arazzo: z.string(),
        info: Info,
        sourceDescriptions: SourceDescription.array(),
        // workflows: Workflow.array(),
        // components: Components,
    })
    .passthrough();

type ArazzoSpecification = z.infer<typeof ArazzoSpecification>;

if (import.meta.main) {
    const file = await Deno.readTextFile("pet-coupons.arazzo.yaml");
    const parsedYaml = parseYaml(file);

    if (parsedYaml && typeof parsedYaml === "object") {
        const result = ArazzoSpecification.parse(parsedYaml);
        console.log(result);
    } else {
        throw "Unable to parse file";
    }
}
