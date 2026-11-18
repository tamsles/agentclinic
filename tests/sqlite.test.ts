import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CREATE_DEMO =
  'CREATE TABLE IF NOT EXISTS demo (id INTEGER PRIMARY KEY, text TEXT)';

describe('node:sqlite in Vitest', () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
  });

  afterEach(() => {
    db.close();
  });

  it('writes a row with parameters and reads it back unchanged', () => {
    db.exec(CREATE_DEMO);

    const text = '你好 AgentClinic';
    const info = db.prepare('INSERT INTO demo (text) VALUES (?)').run(text);

    const row = db
      .prepare('SELECT id, text FROM demo WHERE id = ?')
      .get(info.lastInsertRowid);

    expect(row).toBeDefined();
    expect(row!.text).toBe(text);
    expect(row!.id).toBe(Number(info.lastInsertRowid));
  });

  it('can run CREATE TABLE IF NOT EXISTS twice without error', () => {
    db.exec(CREATE_DEMO);
    expect(() => db.exec(CREATE_DEMO)).not.toThrow();
  });

  it('uses a fresh in-memory database per test', () => {
    const row = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'demo'")
      .get();
    expect(row).toBeUndefined();
  });
});
