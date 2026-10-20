import { build, BunPlugin, write } from "bun";
import { join } from "node:path";
import pkg from "./package.json";

interface Package {
    name: string;
    version: string;
    namespace: string;
    appName: string;
    description: string;
    "shell-version": string[];
    homepage: string;
}

const MetadataGeneratorPlugin = (pkg: Package): BunPlugin => ({
    name: "Extension Metadata Loader",
    setup(build) {
        build.onStart(async () => {
            console.log("Generating extension metadata.json from package.json...");
            if (build.config.outdir === undefined) {
                return;
            }
            const metadata = {
                name: pkg.appName,
                description: pkg.description,
                uuid: `${pkg.name}@${pkg.namespace}`,
                "shell-version": pkg["shell-version"],
                url: pkg.homepage,
                "version-name": pkg.version
            };
            await write(join(build.config.outdir, "metadata.json"), JSON.stringify(metadata, null, 4));
        });
    }
});

await build({
    entrypoints: ["src/extension.ts"],
    outdir: "dist",
    external: ["gi://*", "resource://*"],
    plugins: [MetadataGeneratorPlugin(pkg)]
});
