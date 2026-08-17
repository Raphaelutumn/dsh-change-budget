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
