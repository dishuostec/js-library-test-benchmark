import pinned from './packages.pinned.js';

export { pinned };

const packages = {
	'lodash-es/set': true,
	dset: 'dset',
	'dset/merge': 'dset',
	bury: true,
	'set-value': true,
	'deep-set': true,
	'dot-prop': (m) => m.default.set,
	getobject: 'set',
	'object-path': 'set',
};

export default packages;

export const append_packages = {};

export const known_issues = {};
