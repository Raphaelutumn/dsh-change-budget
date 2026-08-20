import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const english = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
const chinese = readFileSync(new URL('../README.zh.md', import.meta.url), 'utf8')
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  description: string
  keywords: string[]
  repository: { type: string; url: string }
  homepage: string
  bugs: { url: string }
  files: string[]
}

const requiredEnglish = [
  'Why change budgets?',
  'Use cases',
  'How it works',
  'Quick start',
  'Configuration',
  'Counted mutations',
  'Frequently asked questions',
  'Limitations',
  'Contributing',
]

const requiredChinese = [
  '为什么需要修改额度？',
  '适用场景',
  '工作原理',
  '快速开始',
  '配置',
  '计入额度的修改',
  '常见问题',
  '限制',
  '参与贡献',
]

describe('repository presentation', () => {
  it('ships and references the hero asset in both languages', () => {
    expect(existsSync(new URL('../assets/dsh-change-budget-hero.png', import.meta.url))).toBe(true)
    expect(english).toContain('assets/dsh-change-budget-hero.png')
    expect(chinese).toContain('assets/dsh-change-budget-hero.png')
  })

  it('ships and links the runnable runtime demo', () => {
    expect(existsSync(new URL('../scripts/demo.mjs', import.meta.url))).toBe(true)
    expect(existsSync(new URL('../docs/promotion/demo.md', import.meta.url))).toBe(true)
    expect(existsSync(new URL('../assets/dsh-change-budget-demo.svg', import.meta.url))).toBe(true)
    expect(english).toContain('docs/promotion/demo.md')
    expect(chinese).toContain('docs/promotion/demo.md')
  })

  it('keeps the bilingual information architecture aligned', () => {
    for (const heading of requiredEnglish) expect(english).toContain(heading)
    for (const heading of requiredChinese) expect(chinese).toContain(heading)
  })

  it('keeps install, defaults, supported tools, and limitations explicit', () => {
    for (const readme of [english, chinese]) {
      expect(readme).toContain('dsh-change-budget-0.1.0.tgz')
      expect(readme).toContain('maxFilesPerTurn')
      expect(readme).toContain('maxMutationsPerTurn')
      expect(readme).toContain('maxPayloadBytesPerTurn')
      expect(readme).toContain('str_replace_editor')
      expect(readme).toMatch(/Shell|PowerShell/)
      expect(readme).toMatch(/symlink|Symlink|符号链接/)
    }
  })

  it('answers natural-language discovery questions and ships machine-readable facts', () => {
    const llms = readFileSync(new URL('../llms.txt', import.meta.url), 'utf8')
    expect(english).toContain('editing too many files')
    expect(english).toContain('AI coding agent')
    expect(chinese).toContain('一次修改太多文件')
    expect(chinese).toContain('AI 编程 Agent')
    for (const text of [english, chinese, llms]) {
      expect(text).toContain('maxFilesPerTurn')
      expect(text).toContain('maxMutationsPerTurn')
      expect(text).toContain('maxPayloadBytesPerTurn')
      expect(text).toMatch(/Shell|PowerShell/)
    }
  })

  it('publishes consistent npm discovery metadata', () => {
    expect(pkg.description).toMatch(/DeepSeek Harness/i)
    expect(pkg.description).toMatch(/limit/i)
    expect(pkg.keywords).toEqual(expect.arrayContaining([
      'deepseek-harness',
      'dsh-plugin',
      'ai-agent',
      'file-safety',
      'guardrail',
    ]))
    expect(pkg.repository.url).toContain('Raphaelutumn/dsh-change-budget')
    expect(pkg.homepage).toContain('Raphaelutumn/dsh-change-budget')
    expect(pkg.bugs.url).toContain('Raphaelutumn/dsh-change-budget/issues')
    expect(pkg.files).toContain('llms.txt')
  })

  it('exposes CI, a short proof path, and compatibility in both languages', () => {
    for (const readme of [english, chinese]) {
      expect(readme).toContain('actions/workflows/ci.yml/badge.svg')
      expect(readme).toContain('assets/dsh-change-budget-demo.svg')
      expect(readme).toMatch(/30-second|30 秒/)
      expect(readme).toMatch(/Without the plugin|未安装插件/)
      expect(readme).toMatch(/Compatibility|兼容性/)
      expect(readme).toContain('Node.js 20')
      expect(readme).toContain('Node.js 22')
      expect(readme).toContain('Node.js 24')
    }
  })

  it('runs the complete verification command across supported Node releases', () => {
    const workflowUrl = new URL('../.github/workflows/ci.yml', import.meta.url)
    expect(existsSync(workflowUrl)).toBe(true)
    if (!existsSync(workflowUrl)) return
    const workflow = readFileSync(workflowUrl, 'utf8')

    expect(workflow).toContain('node-version: [20, 22, 24]')
    expect(workflow).toContain('corepack pnpm install --frozen-lockfile')
    expect(workflow).toContain('corepack pnpm run verify')
    expect(workflow).toContain('contents: read')
  })
})
