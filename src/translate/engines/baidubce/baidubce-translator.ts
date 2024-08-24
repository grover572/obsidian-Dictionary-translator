import {EngineConfig, from, TranslationStrategy} from "../../const/translate-engines";
import DictionaryPlugin from "../../../main";
import {TranslateRequest} from "../../const/translate-request";
import {TranslateResponse} from "../../const/translate-response";

export class BaiduBceTranslator implements TranslationStrategy {
	config: EngineConfig;
	plugin: DictionaryPlugin;

	async translate(request: TranslateRequest): Promise<TranslateResponse> {
		try {
			return new class implements TranslateResponse {
				boomExplains: [{ type: string; explains: [string] }];
				explains: [any];
				extensions: [{ name: string; value: string }];
				from: from;
				isWord: boolean;
				link: [string];
				source: string;
				speeches: [{ phonetic: string; speech: string; area: string }];
				to: "to";
				translation: [string];
			}
		} catch (error) {
			throw error;
		}
	}




}
