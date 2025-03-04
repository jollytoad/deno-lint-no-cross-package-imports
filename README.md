# Deno Lint Plugin: no-cross-package-imports

This lint plugin prevents relative imports from descending beyond the root of
the package.

The root of the package is currently deemed to be the nearest ancestor directory
containing a `deno.json` file.

So if a relative import within the package descends beyond this and outside of
the deemed current package then the problem is reported.

So given the file structure:

- `foo/deno.json`
- `foo/stuff.ts`
- `bar/util.ts`

and `foo/stuff.ts` has:

```ts
import * as util from "../bar/util.ts";
```

then the lint rule will report the problem.

## Usage

Add the following config to your `deno.json`:

```json
"lint": {
  "plugins": [
    "jsr:@jollytoad/lint-no-cross-package-imports"
  ]
}
```

## Caveat

This lint rule requires filesystem access, but unfortunately it doesn't
currently seem possible to declare this in the plugin or allow it via a flag on
the `deno lint` command. So it will ask for filesystem access when you attempt
to lint with this plugin active.

I don't know of any work-around for this atm, please let me know if you do.
