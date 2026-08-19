import { Context } from '@deepseek-ai/cordis'
import { CallId } from '@deepseek-ai/dsh-llm'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime, { defineTool } from '@deepseek-ai/dsh-tools'
import * as ChangeBudget from '../lib/index.js'

const signal = new AbortController().signal
const events = [{ type: 'turn/start', data: { turn: 1 } }]
const agent = {
  session: {
    header: { cwd: process.cwd() },
    events,
  },
}

const ctx = new Context()
await ctx.plugin(SystemPrompt)
await ctx.plugin(ToolRuntime)
await ctx.plugin(ChangeBudget, {
  maxFilesPerTurn: 2,
  maxMutationsPerTurn: 10,
  maxPayloadBytesPerTurn: 1000,
})

let bodyCalls = 0
ctx.tools.register(defineTool({
  name: 'write',
  description: 'demo write tool',
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

async function write(filePath) {
  return ctx.tools.execute({
    signal,
    agent,
    callId: CallId(filePath),
    name: 'write',
    arguments: { file_path: filePath, content: 'demo' },
  })
}

function text(result) {
  return result.content
    .map((part) => typeof part === 'object' && part !== null && 'text' in part ? part.text : '')
    .join(' ')
}

const first = await write('demo/first.txt')
const second = await write('demo/second.txt')
const third = await write('demo/third.txt')
const reason = text(third)
const displayReason = reason.replace(/^Error:\s*/, '').split(agent.session.header.cwd).join('<cwd>')

if (first.isError || second.isError || !third.isError || bodyCalls !== 2) {
  throw new Error('demo assertion failed: expected two allowed writes and one pre-execution rejection')
}
if (!reason.includes('files would reach 3/2') || !reason.includes('third.txt')) {
  throw new Error('demo assertion failed: rejection reason did not identify the third file')
}

console.log('dsh-change-budget demo')
console.log('limit: maxFilesPerTurn=2')
console.log('write demo/first.txt  -> ALLOWED (tool body ran)')
console.log('write demo/second.txt -> ALLOWED (tool body ran)')
console.log('write demo/third.txt  -> BLOCKED before tool body')
console.log('reason: ' + displayReason)
console.log('tool body calls: ' + bodyCalls)
console.log('result: PASS')
