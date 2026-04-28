export type ParserError = {
  message: string;
  explanation: string;
  index: number;
  line: number;
  column: number;
  expected?: string[];
};

export type SourceLocation = {
  index: number;
  line: number;
  column: number;
};

type ParserErrorInput = {
  message: string;
  explanation: string;
  location: SourceLocation;
  expected?: string[];
};

export function createParserError({
  message,
  explanation,
  location,
  expected
}: ParserErrorInput): ParserError {
  return {
    message,
    explanation,
    index: location.index,
    line: location.line,
    column: location.column,
    ...(expected && expected.length > 0 ? { expected } : {})
  };
}

export function locationFromIndex(input: string, index: number): SourceLocation {
  const safeIndex = Math.max(0, Math.min(index, input.length));
  let line = 1;
  let column = 1;

  for (let position = 0; position < safeIndex; position += 1) {
    if (input[position] === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return {
    index: safeIndex,
    line,
    column
  };
}

export function unexpectedEndError(input: string, expected?: string[]): ParserError {
  return createParserError({
    message: 'Unexpected end of input',
    explanation: 'The expression ended before the parser could complete a valid expression.',
    location: locationFromIndex(input, input.length),
    expected
  });
}
