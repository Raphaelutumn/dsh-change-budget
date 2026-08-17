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
