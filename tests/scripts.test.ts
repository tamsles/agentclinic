import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))

describe('package.json toolchain', () => {
  it('has dev, test, typecheck and validate scripts', () => {
    expect(pkg.scripts.dev).toContain('tsx')
    expect(pkg.scripts.test).toBeTruthy()
    expect(pkg.scripts.typecheck).toBeTruthy()
    expect(pkg.scripts.validate).toBeTruthy()
  })

  it('has tsx and vitest as devDependencies and hono as dependency', () => {
    expect(pkg.devDependencies.tsx).toBeTruthy()
    expect(pkg.devDependencies.vitest).toBeTruthy()
    expect(pkg.dependencies.hono).toBeTruthy()
  })
})
