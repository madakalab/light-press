import {Command} from '../abstracts.js';

export default class HelpCommand extends Command {
	/**
	 * @param {import('../../models/index.js').Event} event
	 */
	async run(event) {
		console.log(`LightPress v${event.packageInfo.version}

Usage:
  $ lightpress <command> [options]

Commands:
	- make <content-type> <title>
  - build
  - help
  - version
`);
	}
}
