# Obsidian-Dictionary-translator
[中文文档](doc%2Freadme%28cn%29.md)
## What Can I Do for You?

This is a simple plugin designed to help you expand your knowledge base while also quickly translating unfamiliar words or sentences and generating flashcards that can be plugged into your notebook. In addition, you can also save the translation engine's pronunciation files to your vault, and you can also record your own pronunciation if you want.
## How to Use

1. Configure the Translation Engine
	![setting.png](doc%2Fsetting.png)
2. Right-click on words for translation (You can record your own pronunciation)
   ![translator.gif](doc%2Ftranslator.gif)

## Supported Translation Engines

- [x] Youdao Translation
- [ ] Google Translate
- [ ] Microsoft Translator

#### Custom Translation Engine

1. Create a Custom Strategy Class: Implement the abstract class `TranslationStrategy`.
2. Add your custom strategy class to `TranslateEngines`:
	1. Make a request to your custom translation engine.
	2. Parse the response and encapsulate it as a `TranslateResponse` type response.
3. Add a unique configuration item for your translation engine in `setting.ts`.

This guide provides a clear and concise explanation of how to utilize the plugin for translating and learning purposes. By following these steps, you can easily integrate a translation engine into your workflow, enhancing your ability to understand and retain new information.
