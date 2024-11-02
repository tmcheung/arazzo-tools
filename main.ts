import { parse as parseYaml } from "jsr:@std/yaml";
import { ArazzoDescription } from "@arazzo-tools/parser";

if (import.meta.main) {
    const file = await Deno.readTextFile("pet-coupons.arazzo.yaml");
    const parsedYaml = parseYaml(file);
    if (parsedYaml && typeof parsedYaml === "object") {
        const result: ArazzoDescription = ArazzoDescription.parse(parsedYaml);
        result.arazzo;
        console.log(JSON.stringify(result, null, 4));
        console.log(result, null, 4);
    } else {
        throw "Unable to parse file";
    }
}
