
export class Event {
	/**
	 * @type {string}
	 */
	projectRoot;

	/**
	 * @type {string}
	 */
	command;

	/**
	 * @type {string[]}
	 */
	options;

	/**
	 * @type {import('./config.js').Config}
	 */
	config;

	/**
	 * @type {import('./package-info.js').PackageInfo}
	 */
	packageInfo;

	/**
	 * @param {Event}
	 */
	constructor({projectRoot, command = 'help', options = [], config, packageInfo}) {
		this.projectRoot = projectRoot;
		this.command = command;
		this.options = options;
		this.config = config;
		this.packageInfo = packageInfo;
	}
}
