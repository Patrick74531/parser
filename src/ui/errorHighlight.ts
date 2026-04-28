import type { ParserError } from '../parser/errors';

export type ErrorHighlight = {
  lineNumber: number;
  columnNumber: number;
  before: string;
  marker: string;
  after: string;
  isEndOfInput: boolean;
};

export function buildErrorHighlight(input: string, error: ParserError): ErrorHighlight {
  const lines = input.split('\n');
  const lineIndex = Math.max(0, error.line - 1);
  const lineText = lines[lineIndex] ?? '';
  const columnIndex = Math.max(0, Math.min(error.column - 1, lineText.length));
  const isEndOfInput = error.index >= input.length;
  const markerLength = getMarkerLength(lineText, columnIndex, error, isEndOfInput);

  return {
    lineNumber: error.line,
    columnNumber: error.column,
    before: lineText.slice(0, columnIndex),
    marker: isEndOfInput ? '' : lineText.slice(columnIndex, columnIndex + markerLength),
    after: isEndOfInput ? '' : lineText.slice(columnIndex + markerLength),
    isEndOfInput
  };
}

function getMarkerLength(
  lineText: string,
  columnIndex: number,
  error: ParserError,
  isEndOfInput: boolean
): number {
  if (isEndOfInput) {
    return 0;
  }

  const quotedToken = error.message.match(/"([^"]+)"/)?.[1];

  if (quotedToken && lineText.startsWith(quotedToken, columnIndex)) {
    return quotedToken.length;
  }

  return 1;
}
