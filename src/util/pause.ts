/**
 * pause(ms)
 * @argument ms: number
 * @returns Promise<void>
 * 
 * Asynchronously waits for the passed-in number of milliseconds
 * before resolving.
 */
export default function pause(ms: number): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(() => { resolve(); }, ms);
	});
}
