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

function normalizePath(
  input: string,
  cwd: string | undefined,
  platform: NodeJS.Platform,
): Pick<ClassifiedMutation, 'path' | 'pathKey'> {
  const api = platform === 'win32' ? win32 : posix
  const normalized = cwd !== undefined && !api.isAbsolute(input)
    ? api.resolve(cwd, input)
    : api.normalize(input)
  return {
    path: normalized,
    pathKey: platform === 'win32' ? normalized.toLowerCase() : normalized,
  }
}

function mutation(
  inputPath: unknown,
  text: unknown,
  cwd: string | undefined,
  platform: NodeJS.Platform,
): ClassifiedMutation | undefined {
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
