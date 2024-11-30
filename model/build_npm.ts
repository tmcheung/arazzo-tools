import { build, emptyDir } from "dnt";
// import * as path from "@std/path";

// function getModuleDir(importMeta: ImportMeta): string {
//     return path.resolve(path.dirname(path.fromFileUrl(importMeta.url)));
// }

await emptyDir("./npm");
// const dir = getModuleDir(import.meta);
const dir = "./";

await build({
    entryPoints: [`${dir}/mod.ts`],
    outDir: `${dir}.npm`,
    shims: {
        deno: true,
    },
    package: {
        name: "@arazzo-tools/model",
        version: Deno.args[0],
        description:
            "This library includes a model for Arazzo descriptions that can be used as a target for parsing, and the base of more complex tooling for the Arazzo specification.",
        license: "MIT",
        repository: {
            type: "git",
            url: "git+https://github.com/tmcheung/arazzo-tools.git",
        },
        bugs: {
            url: "https://github.com/tmcheung/arazzo-tools/issues",
        },
    },
    postBuild() {
        Deno.copyFileSync("LICENSE", "npm/LICENSE");
        Deno.copyFileSync("README.md", "npm/README.md");
    },
});
