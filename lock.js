import https from 'https';
import fs from 'node:fs';
import { pkg_name } from './common/skypack.js';

const get_pinned_url = url => new Promise((resolve, reject) => {

	https.get(url, (res) => {
		if (res.statusCode !== 200) {
			reject(res.statusCode);
		} else {
			resolve(res.headers['x-pinned-url']);
		}

	}).on('error', reject);

});


[
	'deep-equal',
	'deep-clone',
	'object-get',
].forEach(async module => {
	const packages = (await import((`./${module}/js/packages.js`))).default;

	Promise.all(Object.keys(packages)
		.map(pkg_name)
		.filter((value, index, self) => self.indexOf(value) === index,
		)
		.map(async pkg => {
			const url = await get_pinned_url('https://cdn.skypack.dev/' + pkg);
			return { pkg, url };
		}))
		.then(list => {

			const code = list.map(({ pkg, url }) => {
				return `\t'${pkg}': '${url}',`;
			});

			fs.writeFileSync(`./${module}/js/packages.pinned.js`, `export default {
${code.join('\n')}
}`, 'utf8');
		});
});