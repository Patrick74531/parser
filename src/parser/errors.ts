export type ParserError = {
  message: string;
  explanation: string;
  index: number;
  line: number;
  column: number;
  expected?: string[];
};

export function createParserError(input: string, message: string): ParserError {
  return {
    message,
    explanation: 'Parser behavior will be implemented in a later step.',
    index: input.length,
    line: 1,
    column: input.length + 1
  };
}
