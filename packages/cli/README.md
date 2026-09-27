# themeloom (CLI)

```bash
npx themeloom init
```

Detects whether you're on React/Next, Vue/Nuxt, Svelte or plain HTML, writes a
`theme.config.ts` with a house theme to edit, then prints the install command
and the exact snippet to paste in.

It deliberately does **not** run your package manager or edit your source files —
it writes one file you asked for and tells you what to do with it.

```
Usage
  npx themeloom init [options]

Options
  --packs <list>    Theme packs to install (default: classic)
  --kind <kind>     vanilla | react | vue | svelte  (default: auto-detected)
  --config <path>   Where to write the theme config
  --yes, -y         Accept defaults, skip prompts
  --force           Overwrite an existing config
  --help, -h        Show this
```

The scaffolding logic is importable if you'd rather drive it yourself:

```ts
import { scaffold, detectProject } from 'themeloom';

const result = await scaffold({ cwd, kind: await detectProject(cwd), packs: ['classic'] });
// → { written, skipped, install, snippet }
```

## Licence

MIT
