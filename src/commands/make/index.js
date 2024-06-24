import path from 'node:path';
import fs from 'node:fs/promises';
import _ from 'lodash';
import {Command} from '../abstracts.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const defaultStubPath = path.join(__dirname, '..', '..', 'stubs', 'content.stub');

export default class MakeCommand extends Command {
	/**
	 * @param {import('../../models/index.js').Event} event
	 */
	async run(event) {
		const {projectRoot, options, config} = event;
		const [contentType = 'articles', ...titles] = options;
		const inputPath = path.join(projectRoot, config.inputPath);
		const contentTypePath = path.join(inputPath, contentType);
		const title = titles.join(' ') || 'Untitled';

		const customStubPath = path.join(inputPath, `${contentType}.stub`);
		const isCustomStubExists = await fs.access(customStubPath).then(() => true).catch(() => false);
		let stub;
		stub = await (isCustomStubExists ? fs.readFile(customStubPath, 'utf8') : fs.readFile(defaultStubPath, 'utf8'));
		stub = stub.replaceAll('$NOW', new Date().toISOString());
		stub = stub.replaceAll('$TITLE', title);

		await fs.mkdir(contentTypePath, {recursive: true});
		// もし同じタイトルのファイルが存在する場合は、-2, -3, ... というように連番をつける
		const titleKebabCase = _.kebabCase(title).replaceAll('/', '_');
		let id = titleKebabCase;
		let i = 2;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			try {
				const filePath = path.join(contentTypePath, `${id}.md`);
				await fs.access(filePath); // eslint-disable-line no-await-in-loop
				id = `${titleKebabCase}-${i}`;
				i++;
			} catch {
				break;
			}
		}

		const filePath = path.join(contentTypePath, `${id}.md`);
		const shortPath = path.relative(projectRoot, filePath);
		await fs.writeFile(filePath, stub);

		console.log(`Create Successfull!
✅ ${shortPath}
`);
	}
}
