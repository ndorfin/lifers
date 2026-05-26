import yaml from 'js-yaml';
import { createRequire } from 'module';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import path from 'node:path';
import dirOutputPlugin from '@11ty/eleventy-plugin-directory-output';

const require = createRequire(import.meta.url);
const markdownIt = require('markdown-it');
const md = new markdownIt({ html: true });

export default async function (config) {
	/* Add build:prod pathprefix capabilities for builds against gh-pages */
	config.setQuietMode(true);
	config.addPlugin(EleventyHtmlBasePlugin);

	/* Add YAML support */
	config.addDataExtension('yml,yaml', contents => yaml.load(contents));

	/* Copy assets straight through to the `public` folder */
	config.addPassthroughCopy({ 'src/_root': '.' });
	config.addPassthroughCopy({ 'src/assets': 'assets' });

	/* Filters */
	config.addFilter('markdown', content => {
		// Adds markdown support to any field
		// e.g. {{ pattern.description | markdown | safe }}
		return md.render(content);
	});
	config.addFilter('objToArray', data => {
		// When using multiple files in the `data` directory
		// 11ty appends them as key/value pairs to an object.
		// This filter is useful for turning that object into an array,
		// by ignoring the filename (key), and extracting the values.
		return Object.values(data);
	});
	config.addFilter('stringify', data => {
		return JSON.stringify(data, null, '\t');
	});

	return {
		templateFormats: ['html', 'md', 'njk'],
		htmlTemplateEngine: ['njk', 'md'],
		dir: {
			// ⚠️ These values are both relative to your input directory.
			input: './src',
			output: './dist',
			data: './_data',
			includes: './_includes',
			layouts: './_layouts',
		},
	}
}
