export class NullConfigError extends Error {
	constructor(...keys: string[]) {
		super(keys.join(",") + " is null");
		this.name = "NullConfigError";
		if (Error.captureStackTrace) {
			// 修正堆栈跟踪，以便它指向这个自定义的错误类
			Error.captureStackTrace(this, NullConfigError);
		}
	}
}
