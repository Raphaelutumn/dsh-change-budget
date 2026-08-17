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
