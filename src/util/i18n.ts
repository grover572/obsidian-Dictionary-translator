import Mustache from "mustache";
import { moment } from "obsidian";

import { LANGS } from "../langs";
import {TranslateEngines} from "../translate/const/translate-engines";

export type LangType = keyof typeof LANGS;
export type LangTypeAndAuto = LangType | "auto";
export type I18nKey = keyof (typeof LANGS)["en"]

export class I18n {
  lang: LangTypeAndAuto;
  readonly saveSettingFunc: (tolang: LangTypeAndAuto) => Promise<void>;
  constructor(
    lang: LangTypeAndAuto,
    saveSettingFunc: (tolang: LangTypeAndAuto) => Promise<void>
  ) {
    this.lang = lang;
    this.saveSettingFunc = saveSettingFunc;
  }
  async changeTo(anotherLang: LangTypeAndAuto) {
    this.lang = anotherLang;
    await this.saveSettingFunc(anotherLang);
  }

  _get(key: I18nKey) {
    let realLang = this.lang;
    if (this.lang === "auto" && moment.locale().replace("-", "_") in LANGS) {
      realLang = moment.locale().replace("-", "_") as LangType;
    } else {
      realLang = "en";
    }

	// as (typeof LANGS)["en"]是一种类型断言，它告诉TypeScript我们希望将某个值视为与LANGS["en"]相同类型的值
    const res: string =
      (LANGS[realLang] as (typeof LANGS)["en"])[key] || LANGS["en"][key] || key;
    return res;
  }

  t(key: I18nKey, vars?: Record<string, string>) {
    if (vars === undefined) {
      return this._get(key);
    }
    return Mustache.render(this._get(key), vars);
  }
}
