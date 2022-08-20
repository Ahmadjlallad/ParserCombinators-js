export type ParserErrorState = {
	error?: string | null
	isError?: boolean
}

export interface ParserState<T> extends ParserErrorState {
	target: T;
	index?: number;
	result: T | null;
}

export type Parsers<T> = (parserState: ParserState<T>) => ParserState<T>;
