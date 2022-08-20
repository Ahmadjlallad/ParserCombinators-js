import { ParserState, Parsers } from "./parsers.interface";
const updateParserState = <T>(state: ParserState<T>, index: number, result: T) => ({
  ...state,
  index,
  result
});
const updateParserResult = <T>(state: ParserState<T>, result: (T | null)[]) => ({
  ...state,
  result
});
const updateParserError = <T>(state: ParserState<T>, error: string) => ({
  ...state,
  isError: true,
  error
});
const str = (s: string) => (parserState: ParserState<string>) => {
  const { index = 0, target, isError } = parserState;
  if (isError) {
    return parserState
  }
  const sliceTarget = target.slice(index);
  if (sliceTarget.length === 0) {
    return updateParserError(parserState, `str: Tried to match "${s}" but got Unexpected end of input`)
  }
  if (sliceTarget.startsWith(s)) {
    return updateParserState(parserState, index + s.length, s);
  }

  return updateParserError(
    parserState,
    `Tried to match ${s}, but got ${target}`
    );
};

const sequenceOf =
  <T>(parsers: Parsers<T>[]) =>
  (parserState: ParserState<T>) => {
    const result: Array<ParserState<T>["result"]> = [];
    if (parserState.isError) {
      return parserState;
    }
    let nextState = parserState;
    for (const p of parsers) {
      nextState = p(nextState);
      result.push(nextState.result);
    }
    return updateParserResult(nextState, result);
  };
// basic
// const parser = str("hello world");
const parser = sequenceOf<string>([
  str("hello there!"),
  str("goodbye there!"),
])
// parser = parserState in -> parserState out
const run = (parser: Parsers<any>, target: string) => {
  const initialState = {
    target,
    index: 0,
    result: null,
  };
  return parser(initialState);
};
console.log(run(parser, "hello there!goodbye there!"));
