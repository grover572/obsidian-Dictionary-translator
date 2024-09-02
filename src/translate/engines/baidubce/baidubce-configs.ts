import {EngineConfig} from "../../const/translate-engines";

export class BaidubceConfigs implements EngineConfig {

	apiKey: string;
	secretKey: string;

	constructor(apiKey: string, secretKey: string) {
		this.apiKey = apiKey;
		this.secretKey = secretKey;
	}

}
