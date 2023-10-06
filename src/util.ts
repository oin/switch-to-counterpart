/**
 * Splits a string using multiple single-character delimiters.
 * 
 * @param str The string to split.
 * @param delimiters A string containing all the delimiters to use.
 */
export function multisplit(str: string, delimiters: string): string[] {
	if(!delimiters.length) {
		return str.split("");
	}

	let d = delimiters[0];
	for(let i=1; i<delimiters.length; ++i) {
		str = str.split(delimiters[i]).join(d);
	}

	return str.split(d);
}

/**
 * Finds the longest common prefix between two arrays.
 */
export function arrayCommonPrefix<T>(a1: T[], a2: T[]): T[] {
	let i = 0;
	while(i<a1.length && i<a2.length && a1[i] === a2[i]) {
		++i;
	}

	return a2.slice(0, i);
}

/**
 * @return true if a starts with prefix, false otherwise.
 */
export function arrayStartsWith<T>(a: T[], prefix: T[]): boolean {
	if(a.length < prefix.length) {
		return false;
	}

	for(let i=0; i<prefix.length; ++i) {
		if(a[i] !== prefix[i]) {
			return false;
		}
	}

	return true;
}

export function findWithCommonPrefix(reference: string, list: string[], delimiters: string = ".-"): string[] {
	const ref = multisplit(reference, delimiters);
	const l = list.map((str) => multisplit(str, delimiters));
	const minCommonPrefixSplit = l
		.map((e) => arrayCommonPrefix(ref, e))
		.filter((e) => e.length > 0)
		.reduce((a, b) => a.length < b.length? a : b);

	let found = [];
	for(let i=0; i<list.length; ++i) {
		const str = list[i];
		const split = l[i];
		if(arrayStartsWith(split, minCommonPrefixSplit)) {
			found.push(str);
		}
	}
	return found;
}

export function removeLastExtension(str: string): string {
	return str.split(".").slice(0, -1).join(".");
}
