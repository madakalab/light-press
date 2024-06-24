
export class Command {
	/**
	 * @param {import('./event.js').Event} event
	 */
	async run(event) {
		const {command} = event;
		try {
			const CommandClasss = await import(`./commands/${command}.js`);
		} catch {}

		throw new Error('Not implemented');
	}
}
