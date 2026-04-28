import { describe, expect, it } from 'vitest';
import { createNearleyParser, parse } from '../parser/parser';

describe('grammar build', () => {
  it('creates a Nearley parser from the generated grammar', () => {
    const parser = createNearleyParser();

    expect(parser.current).toBe(0);
    expect(parser.grammar.start).toBe('main');
    expect(typeof parser.feed).toBe('function');
  });

  it('parses a simple number through the generated Moo-backed grammar', () => {
    const parser = createNearleyParser();

    parser.feed('42');

    expect(parser.results).toEqual(['42']);
  });

  it('keeps parser consumers on parser module exports', () => {
    expect(typeof createNearleyParser).toBe('function');
    expect(typeof parse).toBe('function');
  });
});
