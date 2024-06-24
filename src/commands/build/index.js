import path from 'node:path';
import fs from 'node:fs/promises';
import parseMD from 'parse-md';
import {marked} from 'marked';
import jsdom from 'jsdom';
import {Command} from '../abstracts.js';

export default class BuildCommand extends Command {
	/**
	 * @param {import('../../models/index.js').Event} event
	 */
	async run(event) {
		const {options} = event;
		if (options.includes('-html') || options.includes('--html')) {
			event.config.html = true;
		}

		if (options.includes('-markdown') || options.includes('--markdown')) {
			event.config.markdown = true;
		}

		const contentTypes = await this.getContentTypes(event);
		const artifactPathes = await Promise.all(contentTypes.map(async contentType => {
			const metaDatas = await this.makeMetaDatas(event, contentType);
			const artifactPath = await this.build(event, contentType, metaDatas);
			return artifactPath;
		}));
		console.log('Build completed!');
		for (const artifactPath of artifactPathes) {
			console.log(`- ${artifactPath}`);
		}
	}

	/**
	 * @param {import('../../models/index.js').Event} event
	 * @returns {Promise<string[]>}
	 */
	async getContentTypes(event) {
		const inputPath = path.join(event.projectRoot, event.config.inputPath);
		const dirents = await fs.readdir(inputPath, {withFileTypes: true});
		return dirents
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name);
	}

	/**
	 * @param {import('../../models/index.js').Event} event
	 * @param {string} contentType
	 * @returns {Promise<Object[]>}
	 */
	async makeMetaDatas(event, contentType) {
		const inputPath = path.join(event.projectRoot, event.config.inputPath);
		const contentPath = path.join(inputPath, contentType);
		const dirents = await fs.readdir(contentPath, {
			withFileTypes: true,
			recursive: true,
		}).then(dirents => dirents.filter(dirent => dirent.isFile() && dirent.name.endsWith('.md')));
		const metaDatas = await Promise.all(dirents.map(async dirent => {
			const filePath = path.join(dirent.parentPath ?? dirent.path, dirent.name);
			const file = await fs.readFile(filePath, 'utf8');
			const {metadata, content: markdown} = parseMD(file);
			const html = marked(markdown);
			const dom = new jsdom.JSDOM(html);
			const titleElement = dom.window.document.querySelector('h1');
			const title = titleElement?.textContent ?? '';
			return {
				id: dirent.name.replace(/\.md$/, ''),
				title,
				...metadata,
				markdown: event.config.markdown ? markdown : undefined,
				html: event.config.html ? html : undefined,
			};
		}));
		return metaDatas
			.filter(metaData => metaData.public)
			.sort((a, b) => a.time - b.time);
	}

	/**
	 * @param {import('../../models/index.js').Event} event
	 * @param {string} contentType
	 * @param {Object[]} metaDatas
	 * @returns {Promise<string>}
	 */
	async build(event, contentType, metaDatas) {
		const outputPath = path.join(event.projectRoot, event.config.outputPath);
		const dataShortPath = path.join(event.config.outputPath, `${contentType}.js`);
		const dataPath = path.join(event.projectRoot, dataShortPath);
		await fs.mkdir(outputPath, {recursive: true});
		await fs.writeFile(dataPath, `export default ${JSON.stringify(metaDatas)};`);
		return dataShortPath;
	}
}
