# dsh-change-budget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, package, install, and verify a DeepSeek Harness plugin that limits structured file mutations per Agent turn.

**Architecture:** A pure classifier converts supported tool calls into normalized mutation reservations. A per-Agent budget tracker atomically reserves concurrent calls and settles them through the Harness tool pipeline. The Cordis entry point exposes validated configuration and wires a monotonic tool guard, an execution wrapper, and a final-result cleanup listener.

**Tech Stack:** TypeScript 5.9, Node.js 22+, Cordis 4.0.1, DeepSeek Harness 0.1.0-rc.5 APIs, Schemastery 3.18.1, Vitest 4.1, pnpm 11.

---

## File map

- Create: D:\Deepseek harness\plugins\dsh-change-budget\package.json — package, bundle, scripts, and published files.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tsconfig.json — strict NodeNext compilation.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\pnpm-workspace.yaml — standalone workspace boundary inside the Harness checkout.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\.gitignore — generated and dependency exclusions.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\LICENSE — MIT license.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\cordis.patch.yml — bundle row inserted into a profile.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\src\classify.ts — supported-tool classification, path normalization, and UTF-8 byte counting.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\src\budget.ts — per-Agent turn state and concurrent reservations.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\src\index.ts — configuration and Cordis pipeline wiring.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tests\classify.spec.ts — classifier behavior.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tests\budget.spec.ts — limits, concurrency, resets, and isolation.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tests\plugin.spec.ts — real ToolRuntime integration without an API key.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\README.md — English consumer reference.
- Create: D:\Deepseek harness\plugins\dsh-change-budget\README.zh.md — Chinese consumer reference.

### Task 1: Create the standalone package shell

**Files:**
- Create: D:\Deepseek harness\plugins\dsh-change-budget\package.json
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tsconfig.json
- Create: D:\Deepseek harness\plugins\dsh-change-budget\pnpm-workspace.yaml
- Create: D:\Deepseek harness\plugins\dsh-change-budget\.gitignore
- Create: D:\Deepseek harness\plugins\dsh-change-budget\LICENSE
- Create: D:\Deepseek harness\plugins\dsh-change-budget\cordis.patch.yml

- [ ] **Step 1: Create package.json**

~~~json
{
  "name": "dsh-change-budget",
  "version": "0.1.0",
  "description": "Per-turn structured file mutation budgets for DeepSeek Harness",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib/**/*.js",
    "lib/**/*.d.ts",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "license": "MIT",
  "dependencies": {
    "@deepseek-ai/schemastery": "3.18.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.1",
    "@deepseek-ai/dsh-tools": "0.1.0-rc.5"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.1",
    "@deepseek-ai/dsh-llm": "0.1.0-rc.5",
    "@deepseek-ai/dsh-system-prompt": "0.1.0-rc.5",
    "@deepseek-ai/dsh-tools": "0.1.0-rc.5",
    "@types/node": "22.20.0",
    "typescript": "5.9.3",
    "vitest": "4.1.1"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "verify": "pnpm run test && pnpm run typecheck && pnpm run build"
  }
}
~~~

- [ ] **Step 2: Create compiler and package support files**

tsconfig.json:

~~~json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2024"],
    "types": ["node"],
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "rewriteRelativeImportExtensions": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "rootDir": "src",
    "outDir": "lib",
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
~~~

.gitignore:

~~~gitignore
node_modules/
lib/
*.tgz
coverage/
~~~

cordis.patch.yml:

~~~yaml
- insert:
    - id: change-budget
      name: dsh-change-budget
~~~

pnpm-workspace.yaml:

~~~yaml
packages:
  - .
~~~

LICENSE:

~~~text
MIT License

Copyright (c) 2026 dsh-change-budget contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
~~~

- [ ] **Step 3: Install the exact development dependencies**

Run:

~~~powershell
Set-Location 'D:\Deepseek harness\plugins\dsh-change-budget'
corepack pnpm install
~~~

Expected: pnpm-lock.yaml is created and install exits with code 0.

- [ ] **Step 4: Commit the package shell**

~~~powershell
git add package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .gitignore LICENSE cordis.patch.yml
git commit -m "chore: scaffold change budget package"
~~~

### Task 2: Classify supported mutation calls

**Files:**
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tests\classify.spec.ts
- Create: D:\Deepseek harness\plugins\dsh-change-budget\src\classify.ts

- [ ] **Step 1: Write failing classifier tests**

~~~ts
import { describe, expect, it } from 'vitest'
import { classifyMutation } from '../src/classify.ts'

describe('classifyMutation', () => {
  it('classifies write and counts UTF-8 bytes', () => {
    expect(classifyMutation('write', {
      file_path: 'src/a.ts',
      content: '中🐳',
    }, 'C:\\repo', 'win32')).toEqual({
      path: 'C:\\repo\\src\\a.ts',
      pathKey: 'c:\\repo\\src\\a.ts',
      payloadBytes: 7,
    })
  })

  it('counts an empty edit as a mutation with zero payload bytes', () => {
    expect(classifyMutation('edit', {
      file_path: '/repo/a.ts',
      old_string: 'remove me',
      new_string: '',
    }, '/repo', 'linux')).toEqual({
      path: '/repo/a.ts',
      pathKey: '/repo/a.ts',
      payloadBytes: 0,
    })
  })

  it.each([
    ['create', { path: '/repo/a.ts', file_text: 'abc' }, 3],
    ['str_replace', { path: '/repo/a.ts', old_str: 'a', new_str: '中' }, 3],
    ['insert', { path: '/repo/a.ts', insert_line: 0, new_str: '🐳' }, 4],
    ['str_replace', { path: '/repo/a.ts', old_str: 'a' }, 0],
  ])('classifies str_replace_editor %s', (command, rest, payloadBytes) => {
    expect(classifyMutation('str_replace_editor', { command, ...rest }, '/repo', 'linux'))
      .toMatchObject({ pathKey: '/repo/a.ts', payloadBytes })
  })

  it('ignores read-only, unsupported, and malformed calls', () => {
    expect(classifyMutation('read', { file_path: 'a.ts' }, '/repo', 'linux')).toBeUndefined()
    expect(classifyMutation('str_replace_editor', { command: 'view', path: '/repo' }, '/repo', 'linux')).toBeUndefined()
    expect(classifyMutation('str_replace_editor', { command: 'insert', path: '/repo/a.ts', new_str: null }, '/repo', 'linux')).toBeUndefined()
    expect(classifyMutation('write', { file_path: 1, content: 'x' }, '/repo', 'linux')).toBeUndefined()
    expect(classifyMutation('write', { file_path: 'a.ts', content: 1 }, '/repo', 'linux')).toBeUndefined()
  })

  it('folds Windows path case but preserves display normalization', () => {
    const upper = classifyMutation('write', { file_path: 'SRC\\A.ts', content: 'x' }, 'C:\\Repo', 'win32')
    const lower = classifyMutation('write', { file_path: 'src\\a.ts', content: 'x' }, 'C:\\Repo', 'win32')
    expect(upper?.pathKey).toBe(lower?.pathKey)
    expect(upper?.path).toBe('C:\\Repo\\SRC\\A.ts')
  })
})
~~~

- [ ] **Step 2: Run the classifier test and verify the expected failure**

Run:

~~~powershell
corepack pnpm vitest run tests/classify.spec.ts
~~~

Expected: FAIL because ../src/classify.ts does not exist.

- [ ] **Step 3: Implement the pure classifier**

~~~ts
import { posix, win32 } from 'node:path'

/** One structured mutation as counted by the per-turn budget. */
export interface ClassifiedMutation {
  /** Normalized path retained for diagnostics. */
  path: string
  /** Platform-aware comparison key used for unique-file accounting. */
  pathKey: string
  /** UTF-8 bytes submitted as replacement or created text. */
  payloadBytes: number
}

type ArgumentsRecord = Record<string, unknown>

function asRecord(value: unknown): ArgumentsRecord | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as ArgumentsRecord
    : undefined
}

function normalizePath(input: string, cwd: string | undefined, platform: NodeJS.Platform): Pick<ClassifiedMutation, 'path' | 'pathKey'> {
  const api = platform === 'win32' ? win32 : posix
  const normalized = cwd !== undefined && !api.isAbsolute(input)
    ? api.resolve(cwd, input)
    : api.normalize(input)
  return {
    path: normalized,
    pathKey: platform === 'win32' ? normalized.toLowerCase() : normalized,
  }
}

function mutation(inputPath: unknown, text: unknown, cwd: string | undefined, platform: NodeJS.Platform): ClassifiedMutation | undefined {
  if (typeof inputPath !== 'string' || inputPath.length === 0 || typeof text !== 'string') return undefined
  return {
    ...normalizePath(inputPath, cwd, platform),
    payloadBytes: Buffer.byteLength(text, 'utf8'),
  }
}

/** Classify a supported DSH tool call; read-only and invalid calls return undefined. */
export function classifyMutation(
  toolName: string,
  argumentsValue: unknown,
  cwd: string | undefined,
  platform: NodeJS.Platform = process.platform,
): ClassifiedMutation | undefined {
  const args = asRecord(argumentsValue)
  if (args === undefined) return undefined
  if (toolName === 'write') return mutation(args.file_path, args.content, cwd, platform)
  if (toolName === 'edit') return mutation(args.file_path, args.new_string, cwd, platform)
  if (toolName !== 'str_replace_editor' || typeof args.command !== 'string') return undefined
  if (args.command === 'create') return mutation(args.path, args.file_text, cwd, platform)
  if (args.command === 'str_replace' || args.command === 'insert') {
    return mutation(args.path, args.new_str === undefined ? '' : args.new_str, cwd, platform)
  }
  return undefined
}
~~~

- [ ] **Step 4: Run classifier tests and typecheck**

Run:

~~~powershell
corepack pnpm vitest run tests/classify.spec.ts
corepack pnpm run typecheck
~~~

Expected: classifier tests and typecheck PASS.

- [ ] **Step 5: Commit classifier behavior**

~~~powershell
git add src/classify.ts tests/classify.spec.ts
git commit -m "feat: classify structured file mutations"
~~~

### Task 3: Enforce limits with concurrent reservations

**Files:**
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tests\budget.spec.ts
- Create: D:\Deepseek harness\plugins\dsh-change-budget\src\budget.ts

- [ ] **Step 1: Write failing budget tests**

~~~ts
import { describe, expect, it } from 'vitest'
import type { ToolExecutionToken } from '@deepseek-ai/dsh-tools'
import { BudgetTracker } from '../src/budget.ts'

const token = (): ToolExecutionToken => Symbol() as ToolExecutionToken
const limits = { maxFilesPerTurn: 2, maxMutationsPerTurn: 3, maxPayloadBytesPerTurn: 10 }
const mutation = (pathKey: string, payloadBytes = 1) => ({ path: pathKey, pathKey, payloadBytes })

describe('BudgetTracker', () => {
  it('reserves, commits, and counts one repeated path once', () => {
    const tracker = new BudgetTracker(limits)
    const agent = {}
    const first = token()
    const second = token()
    expect(tracker.reserve(agent, 1, first, mutation('/a'))).toBeUndefined()
    tracker.settle(agent, first, true)
    expect(tracker.reserve(agent, 1, second, mutation('/a'))).toBeUndefined()
    tracker.settle(agent, second, true)
    expect(tracker.snapshot(agent, 1)).toEqual({ files: 1, mutations: 2, payloadBytes: 2, pending: 0 })
  })

  it('includes pending calls so parallel reservations cannot cross the file limit', () => {
    const tracker = new BudgetTracker({ ...limits, maxFilesPerTurn: 1 })
    const agent = {}
    expect(tracker.reserve(agent, 1, token(), mutation('/a'))).toBeUndefined()
    expect(tracker.reserve(agent, 1, token(), mutation('/b'))).toContain('files would reach 2/1')
  })

  it('releases a failed reservation and permits a replacement call', () => {
    const tracker = new BudgetTracker({ ...limits, maxMutationsPerTurn: 1 })
    const agent = {}
    const failed = token()
    expect(tracker.reserve(agent, 1, failed, mutation('/a'))).toBeUndefined()
    tracker.settle(agent, failed, false)
    expect(tracker.reserve(agent, 1, token(), mutation('/b'))).toBeUndefined()
  })

  it('reports every violated dimension and the blocked path', () => {
    const tracker = new BudgetTracker({ maxFilesPerTurn: 1, maxMutationsPerTurn: 1, maxPayloadBytesPerTurn: 1 })
    const agent = {}
    const first = token()
    tracker.reserve(agent, 1, first, mutation('/a', 1))
    tracker.settle(agent, first, true)
    const reason = tracker.reserve(agent, 1, token(), mutation('/b', 2))
    expect(reason).toContain('files would reach 2/1')
    expect(reason).toContain('mutations would reach 2/1')
    expect(reason).toContain('payload bytes would reach 3/1')
    expect(reason).toContain('Blocked path: \"/b\"')
  })

  it('resets on a new turn and isolates agents', () => {
    const tracker = new BudgetTracker({ ...limits, maxMutationsPerTurn: 1 })
    const a = {}
    const b = {}
    const a1 = token()
    tracker.reserve(a, 1, a1, mutation('/a'))
    tracker.settle(a, a1, true)
    expect(tracker.reserve(a, 1, token(), mutation('/b'))).toContain('mutations would reach 2/1')
    expect(tracker.reserve(a, 2, token(), mutation('/b'))).toBeUndefined()
    expect(tracker.reserve(b, 1, token(), mutation('/c'))).toBeUndefined()
  })
})
~~~

- [ ] **Step 2: Run the budget test and verify the expected failure**

Run:

~~~powershell
corepack pnpm vitest run tests/budget.spec.ts
~~~

Expected: FAIL because ../src/budget.ts does not exist.

- [ ] **Step 3: Implement BudgetTracker**

Implement these exact public types and methods in src/budget.ts:

~~~ts
import type { ToolExecutionToken } from '@deepseek-ai/dsh-tools'
import type { ClassifiedMutation } from './classify.ts'

/** Validated limits for one Agent turn. */
export interface BudgetLimits {
  maxFilesPerTurn: number
  maxMutationsPerTurn: number
  maxPayloadBytesPerTurn: number
}

interface TurnState {
  turn: number
  committedFiles: Set<string>
  committedMutations: number
  committedPayloadBytes: number
  pending: Map<ToolExecutionToken, ClassifiedMutation>
}

/** Read-only accounting snapshot used by tests and diagnostics. */
export interface BudgetSnapshot {
  files: number
  mutations: number
  payloadBytes: number
  pending: number
}

/** In-memory per-Agent accounting with synchronous reservation. */
export class BudgetTracker {
  private readonly states = new WeakMap<object, TurnState>()

  public constructor(private readonly limits: BudgetLimits) {}

  private state(agent: object, turn: number): TurnState {
    const existing = this.states.get(agent)
    if (existing !== undefined && existing.turn === turn) return existing
    const created: TurnState = {
      turn,
      committedFiles: new Set(),
      committedMutations: 0,
      committedPayloadBytes: 0,
      pending: new Map(),
    }
    this.states.set(agent, created)
    return created
  }

  private totals(state: TurnState, extra?: ClassifiedMutation): BudgetSnapshot {
    const files = new Set(state.committedFiles)
    let mutations = state.committedMutations
    let payloadBytes = state.committedPayloadBytes
    for (const pending of state.pending.values()) {
      files.add(pending.pathKey)
      mutations += 1
      payloadBytes += pending.payloadBytes
    }
    if (extra !== undefined) {
      files.add(extra.pathKey)
      mutations += 1
      payloadBytes += extra.payloadBytes
    }
    return { files: files.size, mutations, payloadBytes, pending: state.pending.size }
  }

  public reserve(agent: object, turn: number, token: ToolExecutionToken, item: ClassifiedMutation): string | undefined {
    const state = this.state(agent, turn)
    const projected = this.totals(state, item)
    const violations: string[] = []
    if (projected.files > this.limits.maxFilesPerTurn) {
      violations.push('files would reach ' + projected.files + '/' + this.limits.maxFilesPerTurn)
    }
    if (projected.mutations > this.limits.maxMutationsPerTurn) {
      violations.push('mutations would reach ' + projected.mutations + '/' + this.limits.maxMutationsPerTurn)
    }
    if (projected.payloadBytes > this.limits.maxPayloadBytesPerTurn) {
      violations.push('payload bytes would reach ' + projected.payloadBytes + '/' + this.limits.maxPayloadBytesPerTurn)
    }
    if (violations.length > 0) {
      return 'Change budget exceeded for this turn: ' + violations.join(', ')
        + '. Blocked path: \"' + item.path
        + '\". Raise the plugin limit or continue in a new user turn.'
    }
    state.pending.set(token, item)
    return undefined
  }

  public settle(agent: object, token: ToolExecutionToken, success: boolean): void {
    const state = this.states.get(agent)
    const item = state?.pending.get(token)
    if (state === undefined || item === undefined) return
    state.pending.delete(token)
    if (!success) return
    state.committedFiles.add(item.pathKey)
    state.committedMutations += 1
    state.committedPayloadBytes += item.payloadBytes
  }

  public release(agent: object, token: ToolExecutionToken): void {
    this.settle(agent, token, false)
  }

  public snapshot(agent: object, turn: number): BudgetSnapshot {
    return this.totals(this.state(agent, turn))
  }
}
~~~

- [ ] **Step 4: Run budget and classifier tests**

Run:

~~~powershell
corepack pnpm vitest run tests/classify.spec.ts tests/budget.spec.ts
~~~

Expected: both files PASS.

- [ ] **Step 5: Commit budget accounting**

~~~powershell
git add src/budget.ts tests/budget.spec.ts
git commit -m "feat: reserve per-turn mutation budgets"
~~~

### Task 4: Wire the Cordis tool pipeline

**Files:**
- Create: D:\Deepseek harness\plugins\dsh-change-budget\tests\plugin.spec.ts
- Create: D:\Deepseek harness\plugins\dsh-change-budget\src\index.ts

- [ ] **Step 1: Write a failing ToolRuntime integration test**

The test must mount Context, SystemPrompt, ToolRuntime, and the plugin; register a real write tool; pass a minimal Agent stand-in with an open turn; and assert that a second distinct file is rejected before the tool body runs.

~~~ts
import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { CallId } from '@deepseek-ai/dsh-llm'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime, { defineTool, type ToolExecutionInput } from '@deepseek-ai/dsh-tools'
import * as ChangeBudget from '../src/index.ts'

const signal = new AbortController().signal

function fakeAgent(cwd = 'C:\\repo') {
  const events: Array<{ type: string; data: Record<string, unknown> }> = [
    { type: 'turn/start', data: { turn: 1 } },
  ]
  const agent = {
    session: {
      header: { cwd },
      events,
    },
  } as unknown as NonNullable<ToolExecutionInput['agent']>
  return { agent, events }
}

async function setup(config: ChangeBudget.Config) {
  const ctx = new Context()
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(ChangeBudget, config)
  return ctx
}

describe('dsh-change-budget plugin', () => {
  it('denies the first call that would exceed the unique-file limit', async () => {
    const ctx = await setup({
      maxFilesPerTurn: 1,
      maxMutationsPerTurn: 10,
      maxPayloadBytesPerTurn: 1000,
    })
    let bodyCalls = 0
    ctx.tools.register(defineTool({
      name: 'write',
      description: 'test write',
      parameters: {
        file_path: { type: 'string', required: true },
        content: { type: 'string', required: true },
      },
      output: {
        schema: { type: 'null' },
        render: () => [{ type: 'text', text: 'ok' }],
      },
      async execute() {
        bodyCalls += 1
        return null
      },
    }))
    const { agent } = fakeAgent()
    const first = await ctx.tools.execute({
      signal, agent, callId: CallId('c1'), name: 'write',
      arguments: { file_path: 'a.ts', content: 'a' },
    })
    const second = await ctx.tools.execute({
      signal, agent, callId: CallId('c2'), name: 'write',
      arguments: { file_path: 'b.ts', content: 'b' },
    })
    expect(first.isError).toBe(false)
    expect(second.isError).toBe(true)
    expect(second.content[0]).toMatchObject({ text: expect.stringContaining('files would reach 2/1') })
    expect(bodyCalls).toBe(1)
  })

  it('releases a failed tool body and resets when the session opens a new turn', async () => {
    const ctx = await setup({
      maxFilesPerTurn: 10,
      maxMutationsPerTurn: 1,
      maxPayloadBytesPerTurn: 1000,
    })
    let fail = true
    ctx.tools.register(defineTool({
      name: 'write',
      description: 'test write',
      parameters: {
        file_path: { type: 'string', required: true },
        content: { type: 'string', required: true },
      },
      output: {
        schema: { type: 'null' },
        render: () => [{ type: 'text', text: 'ok' }],
      },
      async execute() {
        if (fail) {
          fail = false
          throw new Error('planned failure')
        }
        return null
      },
    }))
    const { agent, events } = fakeAgent()
    const failed = await ctx.tools.execute({
      signal, agent, callId: CallId('c1'), name: 'write',
      arguments: { file_path: 'a.ts', content: 'a' },
    })
    const recovered = await ctx.tools.execute({
      signal, agent, callId: CallId('c2'), name: 'write',
      arguments: { file_path: 'b.ts', content: 'b' },
    })
    expect(failed.isError).toBe(true)
    expect(recovered.isError).toBe(false)
    events.push(
      { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } },
      { type: 'turn/start', data: { turn: 2 } },
    )
    const nextTurn = await ctx.tools.execute({
      signal, agent, callId: CallId('c3'), name: 'write',
      arguments: { file_path: 'c.ts', content: 'c' },
    })
    expect(nextTurn.isError).toBe(false)
  })
})
~~~

- [ ] **Step 2: Run the integration test and verify the expected failure**

Run:

~~~powershell
corepack pnpm vitest run tests/plugin.spec.ts
~~~

Expected: FAIL because ../src/index.ts does not exist.

- [ ] **Step 3: Implement configuration and pipeline wiring**

~~~ts
/**
 * Per-Agent, per-turn structured file mutation budgets for DeepSeek Harness.
 * @module dsh-change-budget
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { ToolExecution, ToolExecutionResult } from '@deepseek-ai/dsh-tools'
import { BudgetTracker, type BudgetLimits } from './budget.ts'
import { classifyMutation } from './classify.ts'

export const name = 'change-budget'
export const inject = ['tools']

/** User-configurable positive limits applied independently to every Agent turn. */
export interface Config {
  maxFilesPerTurn?: number
  maxMutationsPerTurn?: number
  maxPayloadBytesPerTurn?: number
}

export const Config: z<Config> = z.object({
  maxFilesPerTurn: z.natural().min(1).default(12),
  maxMutationsPerTurn: z.natural().min(1).default(24),
  maxPayloadBytesPerTurn: z.natural().min(1).default(262_144),
})

function openTurn(exec: ToolExecution): number | undefined {
  const events = exec.agent?.session.events
  if (events === undefined) return undefined
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index]
    if (event?.type === 'turn/end') return undefined
    if (event?.type === 'turn/start') return event.data.turn
  }
  return undefined
}

/** Install the monotonic guard and settlement listeners. */
export function apply(ctx: Context, config: Config): void {
  const limits: BudgetLimits = {
    maxFilesPerTurn: config.maxFilesPerTurn as number,
    maxMutationsPerTurn: config.maxMutationsPerTurn as number,
    maxPayloadBytesPerTurn: config.maxPayloadBytesPerTurn as number,
  }
  const tracker = new BudgetTracker(limits)

  ctx.tools.guard((exec) => {
    if (exec.agent === undefined) return undefined
    const turn = openTurn(exec)
    if (turn === undefined) return undefined
    const item = classifyMutation(exec.name, exec.arguments, exec.agent.session.header.cwd)
    if (item === undefined) return undefined
    return tracker.reserve(exec.agent, turn, exec.token, item)
  })

  ctx.on('tools/execute', async (exec, next): Promise<ToolExecutionResult> => {
    try {
      const result = await next()
      if (exec.agent !== undefined) tracker.settle(exec.agent, exec.token, !result.isError)
      return result
    } catch (error: unknown) {
      if (exec.agent !== undefined) tracker.release(exec.agent, exec.token)
      throw error
    }
  })

  ctx.on('tools/result', (exec) => {
    if (exec.agent !== undefined) tracker.release(exec.agent, exec.token)
  })
}
~~~

- [ ] **Step 4: Run all tests, typecheck, and build**

Run:

~~~powershell
corepack pnpm run test
corepack pnpm run typecheck
corepack pnpm run build
~~~

Expected: all tests PASS; typecheck and build exit 0; lib/index.js and declarations exist.

- [ ] **Step 5: Commit the functional plugin**

~~~powershell
git add src/index.ts tests/plugin.spec.ts
git commit -m "feat: enforce change budgets in the tool pipeline"
~~~

### Task 5: Document the consumer contract

**Files:**
- Create: D:\Deepseek harness\plugins\dsh-change-budget\README.md
- Create: D:\Deepseek harness\plugins\dsh-change-budget\README.zh.md
- Modify: D:\Deepseek harness\plugins\dsh-change-budget\package.json

- [ ] **Step 1: Write the English README**

Create README.md with this complete consumer reference:

~~~~markdown
# dsh-change-budget

[中文](README.zh.md)

dsh-change-budget limits structured file mutations for each DeepSeek Harness Agent turn. It tracks write, edit, and the create, str_replace, and insert commands of str_replace_editor before they reach the tool body.

## Install

Install a local checkout into the deployed Web profile:

~~~powershell
$env:DSH_HOME='D:\Deepseek harness\.dsh'
dsh plugin --profile web add 'D:\Deepseek harness\plugins\dsh-change-budget'
~~~

Install a packaged tarball:

~~~powershell
dsh plugin --profile web add .\dsh-change-budget-0.1.0.tgz
~~~

Remove it:

~~~powershell
dsh plugin --profile web remove dsh-change-budget
~~~

## Configuration

| Field | Default | Meaning |
| --- | ---: | --- |
| maxFilesPerTurn | 12 | Maximum distinct normalized paths in one Agent turn |
| maxMutationsPerTurn | 24 | Maximum admitted structured mutation calls in one Agent turn |
| maxPayloadBytesPerTurn | 262144 | Maximum UTF-8 bytes submitted as new text in one Agent turn |

Override the complete plugin config in the profile cordis.patch.yml:

~~~yaml
- id: change-budget
  config:
    maxFilesPerTurn: 20
    maxMutationsPerTurn: 40
    maxPayloadBytesPerTurn: 524288
~~~

Every field must be a positive integer. Invalid configuration fails plugin loading.

## Behavior

The plugin keeps independent counters for each Agent. A new turn/start resets that Agent's counters. Pending parallel calls reserve capacity synchronously, so concurrent calls cannot cross a limit together. A failed tool body releases its reservation; a successful body consumes the reservation even when a later presentation policy blocks the returned result.

Repeated edits of the same normalized path consume additional mutation and byte capacity but count as one distinct file. Windows path keys are case-insensitive. Relative paths use the Session working directory.

## Model experience

The first call that would cross a limit is rejected before the tool body runs:

~~~text
Change budget exceeded for this turn: files would reach 13/12. Blocked path: "src/generated/client.ts". Raise the plugin limit or continue in a new user turn.
~~~

## Limitations

- Bash, PowerShell, and other command tools can mutate files without structured path arguments; those mutations are not counted.
- Symlinks, junctions, and other aliases are not resolved to one physical file.
- Counters are in memory and do not persist across plugin reloads or Harness restarts.
- The package has no dashboard, database, or automatic limit increase.

## Development

~~~powershell
pnpm install
pnpm test
pnpm typecheck
pnpm build
~~~
~~~~

- [ ] **Step 2: Write the Chinese README as a complete counterpart**

Create README.zh.md with this complete counterpart:

~~~~markdown
# dsh-change-budget

[English](README.md)

dsh-change-budget 为每个 DeepSeek Harness Agent 回合限制结构化文件修改规模。插件在工具主体执行前统计 write、edit，以及 str_replace_editor 的 create、str_replace 和 insert 命令。

## 安装

把本地 checkout 安装到已部署的 Web profile：

~~~powershell
$env:DSH_HOME='D:\Deepseek harness\.dsh'
dsh plugin --profile web add 'D:\Deepseek harness\plugins\dsh-change-budget'
~~~

安装打包后的 tarball：

~~~powershell
dsh plugin --profile web add .\dsh-change-budget-0.1.0.tgz
~~~

卸载：

~~~powershell
dsh plugin --profile web remove dsh-change-budget
~~~

## 配置

| 字段 | 默认值 | 含义 |
| --- | ---: | --- |
| maxFilesPerTurn | 12 | 单个 Agent 回合最多触及的不同规范化路径数 |
| maxMutationsPerTurn | 24 | 单个 Agent 回合最多放行的结构化修改调用数 |
| maxPayloadBytesPerTurn | 262144 | 单个 Agent 回合最多提交的新文本 UTF-8 字节数 |

在 profile 的 cordis.patch.yml 中覆盖插件的完整 config：

~~~yaml
- id: change-budget
  config:
    maxFilesPerTurn: 20
    maxMutationsPerTurn: 40
    maxPayloadBytesPerTurn: 524288
~~~

所有字段都必须是正整数。非法配置会导致插件加载失败。

## 行为

插件为每个 Agent 保存独立计数器。新的 turn/start 会重置该 Agent 的额度。并行调用会同步预留额度，因此不能同时穿透上限。工具主体失败会释放预留；工具主体成功后，即使后续展示策略阻止返回结果，该修改仍会消耗额度。

同一规范化路径的重复编辑会继续消耗修改次数和字节额度，但只计为一个不同文件。Windows 路径键不区分大小写。相对路径以 Session 工作目录为基准。

## 模型体验

第一个将要超过上限的调用会在工具主体执行前被拒绝：

~~~text
Change budget exceeded for this turn: files would reach 13/12. Blocked path: "src/generated/client.ts". Raise the plugin limit or continue in a new user turn.
~~~

## 限制

- Bash、PowerShell 和其他命令工具可能在没有结构化路径参数的情况下修改文件；这些修改不计数。
- 符号链接、junction 和其他别名不会合并为同一个物理文件。
- 计数器只保存在内存中，插件重载或 Harness 重启后不会保留。
- 插件不提供仪表盘、数据库或自动提高额度功能。

## 开发

~~~powershell
pnpm install
pnpm test
pnpm typecheck
pnpm build
~~~
~~~~

- [ ] **Step 3: Add the Git-install build hook**

Update the package.json scripts object to this final form after src/index.ts exists:

~~~json
"scripts": {
  "build": "tsc -p tsconfig.json",
  "typecheck": "tsc -p tsconfig.json --noEmit",
  "test": "vitest run",
  "verify": "pnpm run test && pnpm run typecheck && pnpm run build",
  "prepare": "pnpm run build"
}
~~~

- [ ] **Step 4: Verify package contents and documentation consistency**

Run:

~~~powershell
corepack pnpm pack --dry-run
rg -n "maxFilesPerTurn|maxMutationsPerTurn|maxPayloadBytesPerTurn|Shell|符号链接" README.md README.zh.md
~~~

Expected: the dry run lists lib, both READMEs, LICENSE, package.json, and cordis.patch.yml; each configuration field and limitation appears in both languages.

- [ ] **Step 5: Commit documentation and final package scripts**

~~~powershell
git add README.md README.zh.md package.json
git commit -m "docs: document change budget behavior"
~~~

### Task 6: Verify, package, install, and activate

**Files:**
- Modify: D:\Deepseek harness\.dsh\profiles\web\package.json — managed by dsh plugin add.
- Modify: D:\Deepseek harness\.dsh\profiles\web\pnpm-lock.yaml — managed by pnpm.
- Create: C:\Users\29648\Documents\Codex\2026-08-17\qi\outputs\dsh-change-budget-0.1.0.tgz — user-facing package.

- [ ] **Step 1: Run the complete local verification**

~~~powershell
Set-Location 'D:\Deepseek harness\plugins\dsh-change-budget'
corepack pnpm run verify
git diff --check
git status --short
~~~

Expected: verification exits 0, diff check is clean, and only expected generated lib files are ignored.

- [ ] **Step 2: Create the distributable tarball**

~~~powershell
$outputDir='C:\Users\29648\Documents\Codex\2026-08-17\qi\outputs'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
corepack pnpm pack --pack-destination $outputDir
~~~

Expected: outputs\dsh-change-budget-0.1.0.tgz exists.

- [ ] **Step 3: Install the local checkout into the deployed web profile**

~~~powershell
Set-Location 'D:\Deepseek harness'
$env:DSH_HOME='D:\Deepseek harness\.dsh'
corepack pnpm dsh plugin --profile web add ./plugins/dsh-change-budget
~~~

Expected: profile package.json contains dependency dsh-change-budget with a link: specifier, and dsh.profile.bundles contains dsh-change-budget once.

- [ ] **Step 4: Verify the composed configuration without starting a model**

~~~powershell
$dump = corepack pnpm dsh --profile web --dump-config
$dump | Select-String -Pattern 'dsh-change-budget|change-budget'
~~~

Expected: output shows the dsh-change-budget bundle layer and the change-budget plugin row.

- [ ] **Step 5: Run an isolated Web loading smoke**

Start the Web host on port 3180 with the same DSH_HOME:

~~~powershell
$env:DSH_HOME='D:\Deepseek harness\.dsh'
corepack pnpm dsh web --host 127.0.0.1 --port 3180
~~~

From a second shell:

~~~powershell
(Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:3180/').StatusCode
~~~

Expected: HTTP 200 and no change-budget load error in the host output. Stop the isolated host with Ctrl+C after the probe.

- [ ] **Step 6: Activate the plugin in the normal local deployment**

Inspect the process listening on port 3080 and confirm its command line belongs to D:\Deepseek harness before stopping it. If ownership is confirmed, stop that exact process tree, run D:\Deepseek harness\start-dsh.ps1, and verify http://127.0.0.1:3080 returns HTTP 200. If ownership cannot be confirmed, leave the existing process untouched and report that a restart remains.

- [ ] **Step 7: Commit final package metadata if installation changed the plugin repository**

Run:

~~~powershell
Set-Location 'D:\Deepseek harness\plugins\dsh-change-budget'
git status --short
~~~

If pnpm-lock.yaml or built package metadata changed after final verification:

~~~powershell
git add pnpm-lock.yaml package.json
git commit -m "chore: finalize package metadata"
~~~

Expected: plugin repository working tree is clean.

- [ ] **Step 8: Record final evidence**

Capture and report:

- plugin commit hash;
- pnpm test, typecheck, and build results;
- tarball SHA-256;
- profile bundle/readback evidence from --dump-config;
- isolated Web HTTP result;
- normal port 3080 activation status;
- explicit limitations for Shell mutations and filesystem aliases.
