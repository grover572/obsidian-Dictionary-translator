import {EngineConfig} from "../../const/translate-engines";

export class YoudaoConfigs implements EngineConfig {

	appKey: string;
	appSecret: string;

	constructor(appKey: string, appSecret: string) {
		this.appKey = appKey;
		this.appSecret = appSecret;
	}

}
