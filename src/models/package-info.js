import path from 'node:path';
import fs from 'node:fs/promises';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export class PackageInfo {
	/**
	 * @type {string}
	 */
	version;

	/**
	 * @type {string}
	 */
	description;

	static async get() {
		const packageJsonPath = path.join(__dirname, '../../package.json');
		const packageJson = await fs.readFile(packageJsonPath, 'utf8').then(JSON.parse);
		return new this(packageJson);
	}

	/**
	 * @param {PackageInfo}
	 */
	constructor({version, description}) {
		this.version = version;
		this.description = description;
	}
}
