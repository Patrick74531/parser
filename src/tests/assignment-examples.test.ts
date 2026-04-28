import { describe, expect, it } from 'vitest';
import { parse } from '../parser/parser';
import { assignmentExamples } from '../ui/assignmentExamples';

describe('assignment example presets', () => {
  const requiredExamples = [
    ['1 + 2 = 3', 'true'],
    ['2 * 3 + 4 = 10', 'true'],
    ['2 * (3 + 4) = 10', 'false'],
    ['6 = 10 / 2 + 1', 'true'],
    ['12 + 3 != 4 / 2 + 5', 'true'],
    ['2 + 3 * 2 = 10', 'false'],
    ['2 * 3 + 4 != 10', 'false'],
    ['1 + (2 = 3', 'invalid']
  ];

  it('contains every required PDF example in order', () => {
    expect(assignmentExamples.map(({ expression, expected }) => [expression, expected])).toEqual(
      requiredExamples
    );
  });

  it('matches parser behavior for each example outcome', () => {
    for (const example of assignmentExamples) {
      const result = parse(example.expression);

      if (example.expected === 'invalid') {
        expect(result.ok).toBe(false);
        continue;
      }

      expect(result).toMatchObject({
        ok: true,
        result: example.expected === 'true'
      });
    }
  });
});
