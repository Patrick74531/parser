import { describe, expect, it } from 'vitest';
import grammar from '../parser/grammar.generated';
import { DEBUG_PARSER } from '../parser/debug';
import { parse } from '../parser/parser';

describe('project foundation', () => {
  it('keeps parser debug output disabled by default', () => {
    expect(DEBUG_PARSER).toBe(false);
  });

  it('exposes the placeholder parser result shape', () => {
    const result = parse('1 + 2 = 3');

    expect(result).toMatchObject({
      ok: false,
      input: '1 + 2 = 3',
      error: {
        message: 'Parser implementation pending'
      }
    });
  });

  it('imports the generated Nearley grammar module', () => {
    expect(grammar.ParserStart).toBe('main');
    expect(grammar.ParserRules.length).toBeGreaterThan(0);
  });
});
