import { describe, expect, it } from 'vitest';
import { locationFromIndex, unexpectedEndError } from '../parser/errors';

describe('parser error helpers', () => {
  it('calculates one-based line and column from an input index', () => {
    expect(locationFromIndex('12\n  +', 5)).toEqual({
      index: 5,
      line: 2,
      column: 3
    });
  });

  it('builds unexpected end errors at the end of the input', () => {
    expect(unexpectedEndError('1 +')).toMatchObject({
      message: 'Unexpected end of input',
      index: 3,
      line: 1,
      column: 4
    });
  });
});
