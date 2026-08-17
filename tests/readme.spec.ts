import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const english = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
const chinese = readFileSync(new URL('../README.zh.md', import.meta.url), 'utf8')

const requiredEnglish = [
  'Why change budgets?',
  'How it works',
  'Quick start',
  'Configuration',
  'Counted mutations',
  'Limitations',
  'Contributing',
]

const requiredChinese = [
  '为什么需要修改额度？',
  '工作原理',
  '快速开始',
  '配置',
  '计入额度的修改',
  '限制',
  '参与贡献',
]

describe('repository presentation', () => {
  it('ships and references the hero asset in both languages', () => {
    expect(existsSync(new URL('../assets/dsh-change-budget-hero.png', import.meta.url))).toBe(true)
    expect(english).toContain('assets/dsh-change-budget-hero.png')
    expect(chinese).toContain('assets/dsh-change-budget-hero.png')
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
})
