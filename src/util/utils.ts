export function findEmptyKeys<T>(obj: T): string[] {
	const emptyKeys: string[] = [];
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key as keyof T];
			if (value === null || value === undefined || (typeof value === "string" && value === "")) {
				emptyKeys.push(key);
			}
		}
	}
	return emptyKeys;
}

