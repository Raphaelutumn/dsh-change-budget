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
    expect(reason).toContain('Blocked path: "/b"')
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
