import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const packageManifest = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { devDependencies?: Record<string, string>, files?: string[] }

describe('public package metadata', () => {
  it('keeps development dependencies portable', () => {
    for (const specifier of Object.values(packageManifest.devDependencies ?? {})) {
      expect(specifier).not.toMatch(/^(?:file|link):/)
      expect(specifier).not.toMatch(/^[A-Za-z]:[\\/]/)
    }
  })

  it('ships the hero image referenced by the packaged readme', () => {
    expect(packageManifest.files).toContain('assets/dsh-change-budget-hero.png')
  })
})
