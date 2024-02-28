import {from, to} from "./translate-engines";

export interface TranslateRequest {
	from?: from;
	to: to;
	words: string
}
