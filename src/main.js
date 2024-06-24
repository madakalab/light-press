#!/usr/bin/env node

import process from 'node:process';
import {Config, Event, PackageInfo} from './models/index.js';

// Make Event

const [_nodePath, _scriptPath, command, ...options] = process.argv;
const projectRoot = process.cwd();
const config = await Config.get(projectRoot);
const packageInfo = await PackageInfo.get();
const event = new Event({
	projectRoot,
	command,
	options,
	config,
	packageInfo,
});

// console.log(event);

// Routing

/** @type {import('./commands/abstracts.js').Command} */
let CommandClass;
try {
	const module = await import(`./commands/${event.command}/index.js`);
	CommandClass = module.default;
} catch (error) {
	if (error.code === 'ERR_MODULE_NOT_FOUND') {
		const module = await import('./commands/help/index.js');
		CommandClass = module.default;
	} else {
		throw error;
	}
}

// Run command

await new CommandClass().run(event);
