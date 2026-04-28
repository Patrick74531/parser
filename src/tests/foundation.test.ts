import { describe, expect, it } from 'vitest';
import grammar from '../parser/grammar.generated';
import { parse } from '../parser/parser';

describe('project foundation', () => {
  it('exposes the parser result shape', () => {
    const result = parse('1 + 2 = 3');

    expect(result).toMatchObject({
      ok: true,
      input: '1 + 2 = 3',
      result: true
    });
  });

  it('imports the generated Nearley grammar module', () => {
    expect(grammar.ParserStart).toBe('main');
    expect(grammar.ParserRules.length).toBeGreaterThan(0);
  });
});
