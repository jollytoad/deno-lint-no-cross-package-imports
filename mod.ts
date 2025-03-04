import { resolve } from "jsr:@std/path@^1/resolve";
import { dirname } from "jsr:@std/path@^1/dirname";
import { existsSync } from "jsr:@std/fs@^1/exists";

const plugin: Deno.lint.Plugin = {
  name: "no-cross-package-imports",
  rules: {
    "no-cross-package-imports": {
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value.startsWith("..")) {
              const { filename } = context;
              const sourceDir = dirname(filename);
              const relativeImport = node.source.value;
              const absoluteImport = resolve(sourceDir, relativeImport);
              const root = findRoot(filename);

              if (root && !absoluteImport.startsWith(root)) {
                context.report({
                  node,
                  message: "Import should not descend below the package root",
                });
              }
            }
          },
        };
      },
    },
  },
};

export default plugin;

function findRoot(filename: string): string | undefined {
  const dir = dirname(filename);
  if (dir === filename) return undefined;
  if (existsSync(resolve(dir, "deno.json"))) {
    return dir;
  } else {
    return findRoot(dir);
  }
}
