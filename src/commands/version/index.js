import {Command} from '../abstracts.js';

export default class HelpCommand extends Command {
	/**
	 * @param {import('../../models/index.js').Event} event
	 */
	async run(event) {
		console.log(`v${event.packageInfo.version}`);
	}
}
