import path from 'node:path';
import fs from 'node:fs/promises';

export class Config {
	/**
	 * @param {string}
	 */
	inputPath = 'contents';
	outputPath = 'src/contents';

	/**
	 * @param {string} projectRoot
	 * @returns {Promise<Config>}
	 */
	static async get(projectRoot) {
		const packageJsonPath = path.join(projectRoot, 'package.json');
		const packageJson = await fs.readFile(packageJsonPath, 'utf8').then(JSON.parse) ?? {};
		const customConfig = packageJson.lightpress ?? {};
		return new this(customConfig);
	}

	/**
	 * @param {Config}
	 */
	constructor({inputPath = 'contents', outputPath = 'src/contents'}) {
		this.inputPath = inputPath;
		this.outputPath = outputPath;
	}
}
