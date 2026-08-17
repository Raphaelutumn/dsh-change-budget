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

  public reserve(
    agent: object,
    turn: number,
    token: ToolExecutionToken,
    item: ClassifiedMutation,
  ): string | undefined {
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
        + '. Blocked path: "' + item.path
        + '". Raise the plugin limit or continue in a new user turn.'
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
