#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, argv, exit } from 'node:process';
import { detectProject, scaffold, type ProjectKind } from './scaffold.js';

const c = {
  reset: '[0m',
  bold: '[1m',
  dim: '[2m',
  cyan: '[36m',
  green: '[32m',
  yellow: '[33m',
};

const PACKS = [
  { id: 'classic', label: 'classic', detail: '15 themes — glass, tactile, clean, expressive' },
];

function parseArgs(args: string[]) {
  const flags = new Map<string, string | true>();
  const positional: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (value !== undefined) flags.set(key!, value);
      else if (args[i + 1] && !args[i + 1]!.startsWith('-')) flags.set(key!, args[++i]!);
      else flags.set(key!, true);
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

function help(): void {
  console.log(`
${c.bold}themeloom${c.reset} — scaffold theming into an existing project

${c.bold}Usage${c.reset}
  npx themeloom init [options]

${c.bold}Options${c.reset}
  --packs <list>    Theme packs to install (default: classic)
  --kind <kind>     vanilla | react | vue | svelte  (default: auto-detected)
  --config <path>   Where to write the theme config
  --yes, -y         Accept defaults, skip prompts
  --force           Overwrite an existing config
  --help, -h        Show this
`);
}

async function main(): Promise<void> {
  const { flags, positional } = parseArgs(argv.slice(2));
  const command = positional[0] ?? 'init';

  if (flags.has('help') || flags.has('h') || command === 'help') {
    help();
    return;
  }
  if (command !== 'init') {
    console.error(`Unknown command "${command}". Try: npx themeloom init`);
    exit(1);
  }

  const cwd = process.cwd();
  const detected = await detectProject(cwd);
  const skipPrompts = flags.has('yes') || flags.has('y') || !stdin.isTTY;

  let kind = (flags.get('kind') as ProjectKind | undefined) ?? detected;
  let packs = String(flags.get('packs') ?? 'classic')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`\n${c.bold}themeloom${c.reset} ${c.dim}init${c.reset}`);
  console.log(`${c.dim}Detected project:${c.reset} ${detected === 'unknown' ? 'no package.json — assuming plain HTML' : detected}\n`);

  if (!skipPrompts && !flags.has('kind')) {
    const rl = createInterface({ input: stdin, output: stdout });
    try {
      const kindAnswer = (await rl.question(`Project type ${c.dim}(${kind})${c.reset}: `)).trim();
      if (kindAnswer) kind = kindAnswer as ProjectKind;

      console.log(`\n${c.dim}Available packs:${c.reset}`);
      for (const pack of PACKS) console.log(`  ${c.cyan}${pack.id}${c.reset} — ${pack.detail}`);
      const packAnswer = (await rl.question(`\nPacks to install ${c.dim}(${packs.join(',')})${c.reset}: `)).trim();
      if (packAnswer) packs = packAnswer.split(',').map((s) => s.trim()).filter(Boolean);
    } finally {
      rl.close();
    }
  }

  if (kind === 'unknown') kind = 'vanilla';

  const result = await scaffold({
    cwd,
    kind,
    packs,
    force: flags.has('force'),
    ...(typeof flags.get('config') === 'string' ? { configPath: flags.get('config') as string } : {}),
  });

  console.log('');
  for (const file of result.written) console.log(`  ${c.green}created${c.reset}  ${file}`);
  for (const file of result.skipped) {
    console.log(`  ${c.yellow}skipped${c.reset}  ${file} ${c.dim}(already exists — pass --force to overwrite)${c.reset}`);
  }

  console.log(`\n${c.bold}1. Install${c.reset}`);
  console.log(`   npm install ${result.install.join(' ')}`);
  console.log(`\n${c.bold}2. Drop this in${c.reset}`);
  console.log(result.snippet.split('\n').map((line) => '   ' + line).join('\n'));
  console.log(`\n${c.dim}Then edit ${result.written[0] ?? 'your theme config'} to make the house theme yours.${c.reset}\n`);
}

main().catch((error: unknown) => {
  console.error(`\n[themeloom] ${(error as Error).message}\n`);
  exit(1);
});
